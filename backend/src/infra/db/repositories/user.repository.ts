import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from '@/infra/db/entities/user.entity'
import { IUserRepository } from '@/core/domain/repositories/user.repository'
import { User } from '@/core/domain/entities/user'

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async create(user: User): Promise<User> {
    return {
      error: 'Coming soon'
    } as any
  }

  async findAll(): Promise<User[]> {
    return {
      error: 'Coming soon'
    } as any
  }

  async findById(id: string): Promise<User | null> {
    return {
      error: 'Coming soon'
    } as any
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    return {
      error: 'Coming soon'
    } as any
  }

  async delete(id: string): Promise<void> {
    return {
      error: 'Coming soon'
    } as any
  }
}
