import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '@/infra/db/entities/user.entity'
import { UserModule } from '@/infra/modules/user.module'
import { AuthModule } from '@/infra/modules/auth.module'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [UserEntity],
        synchronize: false,
      }),
    }),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
