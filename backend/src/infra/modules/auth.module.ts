import { Module } from '@nestjs/common';
import { AuthController } from '@/adapters/controllers/auth.controller';
import { AuthService } from '@/core/use-cases/auth.service';
import { UserModule } from '@/infra/modules/user.module';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
