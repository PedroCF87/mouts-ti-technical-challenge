import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../../core/use-cases/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  login() {
    return {
      error: 'Coming soon'
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken() {
    return {
      error: 'Coming soon'
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout() {
    return {
      error: 'Coming soon'
    };
  }
}
