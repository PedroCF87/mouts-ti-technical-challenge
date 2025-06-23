import request from 'supertest'

const api = request('http://localhost:3000')

describe('Auth BFF API (e2e)', () => {
  let accessToken: string
  let refreshToken: string

  it('should login and return access and refresh tokens', async () => {
    const loginDto = {
      username: 'johndoe',
      password: 'your_password_here',
    }
    const response = await api.post('/api/auth').send(loginDto)
    expect(response.status).toBe(200)
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
    const response = await api.post('/api/auth/refresh').send({ refreshToken })
    expect(response.status).toBe(200)
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
    const response = await api.post('/api/auth/logout').send({ refreshToken })
    expect([200, 204]).toContain(response.status)
    if (response.status === 200) {
      expect((response.text || '').toLowerCase()).toContain('success')
    }
  })
})
