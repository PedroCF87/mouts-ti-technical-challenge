import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'

describe('AuthController (e2e)', () => {
  let app: INestApplication
  let accessToken: string
  let refreshToken: string

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should login and return access and refresh tokens', async () => {
    const loginDto = {
      username: 'johndoe',
      password: 'your_password_here',
    }
    const response = await request(app.getHttpServer())
      .post('/auth')
      .send(loginDto)
      .expect(200)
    expect(response.body).toHaveProperty('access_token')
    expect(typeof response.body.access_token).toBe('string')
    expect(response.body.access_token.length).toBeGreaterThan(0)
    expect(response.body).toHaveProperty('refresh_token')
    expect(typeof response.body.refresh_token).toBe('string')
    expect(response.body.refresh_token.length).toBeGreaterThan(0)
    accessToken = response.body.access_token
    refreshToken = response.body.refresh_token
  })

  it('should refresh token and return new access token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken })
      .expect(200)
    expect(response.body).toHaveProperty('access_token')
    expect(typeof response.body.access_token).toBe('string')
    expect(response.body.access_token.length).toBeGreaterThan(0)
    accessToken = response.body.access_token
    if (response.body.refresh_token) {
      expect(typeof response.body.refresh_token).toBe('string')
      expect(response.body.refresh_token.length).toBeGreaterThan(0)
      refreshToken = response.body.refresh_token
    }
  })

  it('should logout successfully', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/logout')
      .send({ refreshToken })
      .expect((res) => {
        expect([200, 204]).toContain(res.status)
      })
    if (response.status === 200) {
      expect(
        (response.text || '').toLowerCase()
      ).toContain('success')
    }
  })
})
