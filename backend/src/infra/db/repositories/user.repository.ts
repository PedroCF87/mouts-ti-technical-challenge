import { Injectable } from '@nestjs/common'
import { Repository, QueryFailedError } from 'typeorm'
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

  async create(user: User): Promise<User | { error: string }> {
    try {
      const newUser = this.repository.create(user)
      const savedUser = await this.repository.save(newUser)
      return this.mapToUser(savedUser)

    } catch (error) {

      if (error instanceof QueryFailedError && (error as any).code === '23505') {
        return { error: 'E-mail já cadastrado.' };
      }
      return { error: error.message ?? 'User not created' };
    }
  }

  async findAll(): Promise<User[]> {
    const users = await this.repository.find();
    return users.map(user => this.mapToUser(user));
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.repository.findOneBy({ id });
    return user ? this.mapToUser(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repository.findOneBy({ email });
    return user ? this.mapToUser(user) : null;
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    await this.repository.update(id, user);
    const updatedUser = await this.repository.findOneBy({ id });
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return this.mapToUser(updatedUser);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private mapToUser(entity: UserEntity): User {
    const user = new User();
    user.id = entity.id;
    user.email = entity.email;
    user.role = entity.role;
    user.name = entity.name;
    user.isActive = entity.isActive;
    user.createdAt = entity.createdAt;
    user.updatedAt = entity.updatedAt;
    return user;
  }
}
