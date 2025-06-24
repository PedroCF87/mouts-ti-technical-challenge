import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from '@/adapters/controllers/auth.controller';
import { AuthService } from '@/core/use-cases/auth.service';
import { UserModule } from '@/infra/modules/user.module';
import { UserRepository } from '@/adapters/repositories/user.repository';
import { UserEntity } from '@/infra/db/entities/user.entity';
import { JwtStrategy } from '@/adapters/controllers/jwt.strategy';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: UserRepository,
      useClass: UserRepository,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
