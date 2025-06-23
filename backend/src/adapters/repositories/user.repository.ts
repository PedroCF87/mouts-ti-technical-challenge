import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { UserEntity } from '@/infra/db/entities/user.entity';
import { IUserRepository } from '@/core/domain/repositories/user.repository';
import { User } from '@/core/domain/entities/user';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const userEntity = this.repository.create(userData as DeepPartial<UserEntity>);
    const savedEntity = await this.repository.save(userEntity);
    return this.mapToUser(savedEntity);
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOneBy({ id });
    return entity ? this.mapToUser(entity) : null;
  }

  async findAll(): Promise<User[]> {
    const entities = await this.repository.find();
    return entities.map(entity => this.mapToUser(entity));
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    await this.repository.update(id, userData as DeepPartial<UserEntity>);
    const updatedEntity = await this.repository.findOneBy({ id });
    if (!updatedEntity) {
      throw new Error('User not found');
    }
    return this.mapToUser(updatedEntity);
  }

  private mapToUser(entity: UserEntity): User {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      password: entity.password,
      role: entity.role,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }
}
