import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@/core/use-cases/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '@/adapters/repositories/user.repository';
import { UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

const mockUserRepository = () => ({
  findByEmail: jest.fn(),
  findById: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(),
  verify: jest.fn(),
});

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: ReturnType<typeof mockUserRepository>;
  let jwtService: ReturnType<typeof mockJwtService>;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useFactory: mockUserRepository },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userRepository = moduleRef.get(UserRepository);
    jwtService = moduleRef.get(JwtService);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('login', () => {
    it('should return tokens and user data for valid credentials', async () => {
      const user = { id: '1', email: 'test@test.com', password: 'hashed', isActive: true, name: 'Test', role: 'user' };
      userRepository.findByEmail.mockResolvedValue(user);
      (compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');

      const result = await authService.login({ email: 'test@test.com', password: 'password' });
      expect(result).toEqual({
        access_token: 'access-token',
        refresh_token: 'refresh-token',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      await expect(authService.login({ email: 'notfound@test.com', password: 'password' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is inactive', async () => {
      userRepository.findByEmail.mockResolvedValue({ isActive: false });
      await expect(authService.login({ email: 'inactive@test.com', password: 'password' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      userRepository.findByEmail.mockResolvedValue({ id: '1', email: 'test@test.com', password: 'hashed', isActive: true });
      (compare as jest.Mock).mockResolvedValue(false);
      await expect(authService.login({ email: 'test@test.com', password: 'wrong' }))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshToken', () => {
    let redisMock: any;
    beforeEach(() => {
      redisMock = {
        get: jest.fn(),
        set: jest.fn(),
      };
      (authService as any).redis = redisMock;
    });

    it('should return new tokens and user data for valid refresh token', async () => {
      redisMock.get.mockResolvedValue(null); // not used or blocked
      jwtService.verify.mockReturnValue({ sub: '1' });
      const user = { id: '1', email: 'test@test.com', isActive: true, name: 'Test', role: 'user' };
      userRepository.findById.mockResolvedValue(user);
      jwtService.sign.mockReturnValueOnce('new-access-token').mockReturnValueOnce('new-refresh-token');

      const result = await authService.refreshToken({ refreshToken: 'valid-refresh-token' });
      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
      expect(redisMock.set).toHaveBeenCalledWith(
        'used-refresh-token:valid-refresh-token',
        '1',
        'EX',
        60 * 60 * 24 * 7
      );
    });

    it('should throw UnauthorizedException if refresh token is used', async () => {
      redisMock.get.mockResolvedValueOnce('1'); // used
      await expect(authService.refreshToken({ refreshToken: 'used-token' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if refresh token is blocked', async () => {
      redisMock.get.mockResolvedValueOnce(null).mockResolvedValueOnce('1'); // not used, but blocked
      await expect(authService.refreshToken({ refreshToken: 'blocked-token' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if jwtService.verify throws', async () => {
      redisMock.get.mockResolvedValue(null);
      jwtService.verify.mockImplementation(() => { throw new Error('invalid'); });
      await expect(authService.refreshToken({ refreshToken: 'invalid-token' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found or inactive', async () => {
      redisMock.get.mockResolvedValue(null);
      jwtService.verify.mockReturnValue({ sub: '1' });
      userRepository.findById.mockResolvedValue(null);
      await expect(authService.refreshToken({ refreshToken: 'notfound-token' }))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    let redisMock: any;
    beforeEach(() => {
      redisMock = {
        set: jest.fn(),
      };
      (authService as any).redis = redisMock;
    });

    it('should block the refresh token and return success', async () => {
      redisMock.set.mockResolvedValue('OK');
      const result = await authService.logout({ refreshToken: 'logout-token' });
      expect(redisMock.set).toHaveBeenCalledWith(
        'blocked-list-refresh-token:logout-token',
        '1',
        'EX',
        60 * 60 * 24 * 7
      );
      expect(result).toEqual({ success: true, message: 'Logout successful.' });
    });
  });
});
