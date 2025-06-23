import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '@/core/domain/repositories/user.repository';
import { User } from '@/core/domain/entities/user';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    return this.userRepository.create(userData);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findById(userId: string): Promise<User | null> {
    return this.userRepository.findById(userId);
  }

  async update(userId: string, userData: Partial<User>): Promise<User> {
    return this.userRepository.update(userId, userData);
  }

  async delete(userId: string): Promise<void> {
    return this.userRepository.delete(userId);
  }
}
