import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { IUserRepository } from '@/core/domain/repositories/user.repository';
import { User } from '@/core/domain/entities/user';
import { RedisService } from '@/infra/redis/redis.service';

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<IUserRepository>;
  let moduleRef: TestingModule;

  const generateUserMock = (overrides = {}): User => ({
    email: `test${Math.random().toString(36).substring(2, 8)}@example.com`,
    password: '123456',
    role: 'user',
    isActive: true,
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  let userMock: User;

  beforeEach(async () => {
    userMock = generateUserMock();
    userRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: 'IUserRepository', useValue: userRepository },
        { provide: RedisService, useValue: { get: jest.fn(), set: jest.fn(), del: jest.fn() } },
      ],
    }).compile();

    service = moduleRef.get<UserService>(UserService);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      userRepository.create.mockResolvedValue(userMock);
      const result = await service.create(userMock);
      expect(result).toEqual(userMock);
      expect(userRepository.create).toHaveBeenCalledWith(userMock);
    });
    it('should return error object on repository error', async () => {
      userRepository.create.mockImplementation(() => { throw new Error('fail'); });
      const result = await service.create(userMock);
      expect(result).toEqual({ error: 'fail' });
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      userRepository.findAll.mockResolvedValue([userMock]);
      const result = await service.findAll();
      expect(result).toEqual([userMock]);
    });
    it('should return empty array on repository error', async () => {
      userRepository.findAll.mockImplementation(() => { throw new Error('fail'); });
      await expect(service.findAll()).rejects.toThrow('fail');
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      userRepository.findById.mockResolvedValue(userMock);
      const result = await service.findById('1');
      expect(result).toEqual(userMock);
    });
    it('should return null if user not found', async () => {
      userRepository.findById.mockResolvedValue(null);
      const result = await service.findById('2');
      expect(result).toBeNull();
    });
    it('should throw on repository error', async () => {
      userRepository.findById.mockImplementation(() => { throw new Error('fail'); });
      await expect(service.findById('1')).rejects.toThrow('fail');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      userRepository.update.mockResolvedValue(userMock);
      const result = await service.update('1', { name: 'Updated' });
      expect(result).toEqual(userMock);
      expect(userRepository.update).toHaveBeenCalledWith('1', { name: 'Updated' });
    });
    it('should throw on repository error', async () => {
      userRepository.update.mockImplementation(() => { throw new Error('fail'); });
      await expect(service.update('1', { name: 'Updated' })).rejects.toThrow('fail');
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      userRepository.delete.mockResolvedValue(undefined);
      await expect(service.delete('1')).resolves.toBeUndefined();
      expect(userRepository.delete).toHaveBeenCalledWith('1');
    });
    it('should throw on repository error', async () => {
      userRepository.delete.mockImplementation(() => { throw new Error('fail'); });
      await expect(service.delete('1')).rejects.toThrow('fail');
    });
  });
});
