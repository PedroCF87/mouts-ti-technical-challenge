import { Module } from '@nestjs/common';
import { AuthController } from './adapters/controllers/auth.controller';
import { AuthService } from './core/use-cases/auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
