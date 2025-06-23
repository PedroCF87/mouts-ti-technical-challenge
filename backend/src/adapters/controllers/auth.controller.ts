import { Controller, Post } from '@nestjs/common';
import { AuthService } from '../../core/use-cases/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login() {
    return this.authService.login();
  }

  @Post('refresh')
  refreshToken() {
    return this.authService.refreshToken();
  }

  @Post('logout')
  logout() {
    return this.authService.logout();
  }
}
