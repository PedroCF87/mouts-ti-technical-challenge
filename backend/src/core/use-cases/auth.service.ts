import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcrypt'
import { LoginDto, RefreshTokenDto, LogoutDto } from '@/adapters/dtos/auth.dto'
import { UserRepository } from '@/adapters/repositories/user.repository'
import Redis from 'ioredis'

@Injectable()
export class AuthService {
  private readonly redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    // Find the user by email
    const user = await this.userRepository.findByEmail(loginDto.email)

    // If user doesn't exist or is inactive, throw unauthorized exception
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Validate password
    const isPasswordValid = await compare(loginDto.password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Generate JWT token
    const payload = { 
      sub: user.id, 
      email: user.email,
      role: user.role
    }

    const accessToken = this.jwtService.sign(payload)
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '7d' }
    )
    
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      // Check if the refresh token has already been used or is in the blocked list
      const used = await this.redis.get(`used-refresh-token:${refreshTokenDto.refreshToken}`);
      const blocked = await this.redis.get(`blocked-list-refresh-token:${refreshTokenDto.refreshToken}`);
      if (used || blocked) {
        throw new UnauthorizedException('Refresh token is invalid or already used.');
      }
      // Verify and decode the refresh token
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken);
      const userId = payload.sub;
      if (!userId) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      // Find the user by ID
      const user = await this.userRepository.findById(userId);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }
      // Mark the refresh token as used in Redis (expires in 7 days)
      await this.redis.set(`used-refresh-token:${refreshTokenDto.refreshToken}`, '1', 'EX', 60 * 60 * 24 * 7);
      // Generate new tokens
      const newPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };
      const accessToken = this.jwtService.sign(newPayload);
      const refreshToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '7d' });
      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(logoutDto: LogoutDto) {
    // Save the refreshToken in the blocked-list in Redis (expires in 7 days)
    await this.redis.set(`blocked-list-refresh-token:${logoutDto.refreshToken}`, '1', 'EX', 60 * 60 * 24 * 7);
    return { success: true, message: 'Logout successful.' };
  }
}
