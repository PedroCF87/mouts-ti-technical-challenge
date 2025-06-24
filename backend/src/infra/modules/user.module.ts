import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '@/adapters/controllers/user.controller';
import { UserService } from '@/core/use-cases/user.service';
import { UserRepository } from '@/infra/db/repositories/user.repository';
import { UserEntity } from '@/infra/db/entities/user.entity';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), RedisModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    UserRepository
  ],
  exports: [UserService, UserRepository, 'IUserRepository']
})
export class UserModule {}
