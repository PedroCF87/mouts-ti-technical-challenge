import { Injectable, Inject } from '@nestjs/common'
import { IUserRepository } from '@/core/domain/repositories/user.repository'
import { User } from '@/core/domain/entities/user'
import { RedisService } from '@/infra/redis/redis.service'

@Injectable()
export class UserService {
  private readonly userListKey = 'users:all'

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly redisService: RedisService,
  ) {}

  async create(userData: Partial<User>): Promise<User | { error: string }> {
    try {
      const user = await this.userRepository.create(userData)
      await this.updateUsersCache()
      return user
    } catch (error) {
      return { error: error.message ?? 'User not created' }
    }
  }

  async findAll(): Promise<User[]> {
    const cachedUsers = await this.redisService.get(this.userListKey)
    if (cachedUsers) {
      return JSON.parse(cachedUsers)
    }

    const users = await this.userRepository.findAll()
    await this.redisService.set(this.userListKey, JSON.stringify(users))
    return users
  }

  async findById(userId: string): Promise<User | null> {
    return this.userRepository.findById(userId)
  }

  async update(userId: string, userData: Partial<User>): Promise<User> {
    const user = await this.userRepository.update(userId, userData)
    await this.updateUsersCache()
    return user
  }

  async delete(userId: string): Promise<void> {
    await this.userRepository.delete(userId)
    await this.updateUsersCache()
  }

  private async updateUsersCache() {
    const users = await this.userRepository.findAll()
    await this.redisService.set(this.userListKey, JSON.stringify(users))
  }
}
