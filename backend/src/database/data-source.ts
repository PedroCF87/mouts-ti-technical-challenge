import 'dotenv/config'
import { DataSource } from 'typeorm'
import { UserEntity } from '@/infra/db/entities/user.entity'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [UserEntity],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
})
