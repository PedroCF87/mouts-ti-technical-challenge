import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  let createdUser: any;

  it('should create a valid user (POST /users)', async () => {
    const userDto = {
      name: 'Usuário Teste',
      email: 'teste@example.com',
      password: 'senha123',
    };
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(userDto)
      .expect(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(userDto.name);
    expect(response.body.email).toBe(userDto.email);
    createdUser = response.body;
  });

  it('should list all users (GET /users)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.find((u: any) => u.id === createdUser.id)).toBeTruthy();
  });

  it('should get a user by ID (GET /users/:id)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${createdUser.id}`)
      .expect(200);
    expect(response.body.id).toBe(createdUser.id);
    expect(response.body.email).toBe(createdUser.email);
  });

  it('should update a user (PUT /users/:id)', async () => {
    const updateDto = { name: 'Usuário Atualizado' };
    const response = await request(app.getHttpServer())
      .put(`/users/${createdUser.id}`)
      .send(updateDto)
      .expect(200);
    expect(response.body.name).toBe(updateDto.name);
  });

  it('should delete a user (DELETE /users/:id)', async () => {
    await request(app.getHttpServer())
      .delete(`/users/${createdUser.id}`)
      .expect(200);
    // Confirma que foi removido
    await request(app.getHttpServer())
      .get(`/users/${createdUser.id}`)
      .expect(404);
  });

  it('should return 404 when getting a non-existent user', async () => {
    await request(app.getHttpServer())
      .get('/users/999999')
      .expect(404);
  });

  it('should return error when trying to create a user with duplicate email', async () => {
    const userDto = {
      name: 'Outro Usuário',
      email: 'teste@example.com',
      password: 'outrasenha',
    };
    // Cria o primeiro usuário
    await request(app.getHttpServer())
      .post('/users')
      .send(userDto)
      .expect(201);
    // Tenta criar novamente com o mesmo email
    await request(app.getHttpServer())
      .post('/users')
      .send(userDto)
      .expect(409);
  });
});
