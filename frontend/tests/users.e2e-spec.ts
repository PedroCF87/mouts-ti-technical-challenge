import request from 'supertest'

const api = request('http://localhost:3000')

describe('Users BFF API (e2e)', () => {
  let createdUser: any

  const expectUserShape = (user: any) => {
    expect(user).toHaveProperty('id')
    expect(typeof user.id).toBe('number')
    expect(user).toHaveProperty('name')
    expect(typeof user.name).toBe('string')
    expect(user).toHaveProperty('email')
    expect(typeof user.email).toBe('string')
    expect(user).not.toHaveProperty('password')
    expect(user).toHaveProperty('role')
    expect(['user', 'admin']).toContain(user.role)
    expect(user).toHaveProperty('isActive')
    expect(typeof user.isActive).toBe('boolean')
    expect(user).toHaveProperty('createdAt')
    expect(typeof user.createdAt).toBe('string')
    expect(new Date(user.createdAt).toISOString()).toBe(user.createdAt)
    expect(user).toHaveProperty('updatedAt')
    expect(typeof user.updatedAt).toBe('string')
    expect(new Date(user.updatedAt).toISOString()).toBe(user.updatedAt)
  }

  it('should create a valid user (POST /api/users)', async () => {
    const userDto = {
      name: 'Frontend Test User',
      email: 'frontend-test@example.com',
      password: 'senha123',
    }
    const response = await api.post('/api/users').send(userDto)
    expect(response.status).toBe(201)
    expectUserShape(response.body)
    expect(response.body.name).toBe(userDto.name)
    expect(response.body.email).toBe(userDto.email)
    expect(response.body.role).toBe('user')
    expect(response.body.isActive).toBe(true)
    createdUser = response.body
  })

  it('should list all users (GET /api/users)', async () => {
    const response = await api.get('/api/users')
    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    response.body.forEach(expectUserShape)
    const found = response.body.find((u: any) => u.id === createdUser.id)
    expect(found).toBeTruthy()
    expectUserShape(found)
  })

  it('should get a user by ID (GET /api/users/:id)', async () => {
    const response = await api.get(`/api/users/${createdUser.id}`)
    expect(response.status).toBe(200)
    expectUserShape(response.body)
    expect(response.body.id).toBe(createdUser.id)
    expect(response.body.email).toBe(createdUser.email)
  })

  it('should update a user (PUT /api/users/:id)', async () => {
    const updateDto = { name: 'Frontend Updated User', isActive: false }
    const response = await api
      .put(`/api/users/${createdUser.id}`)
      .send(updateDto)
    expect(response.status).toBe(200)
    expectUserShape(response.body)
    expect(response.body.name).toBe(updateDto.name)
    expect(response.body.isActive).toBe(false)
  })

  it('should delete a user (DELETE /api/users/:id)', async () => {
    const delRes = await api.delete(`/api/users/${createdUser.id}`)
    expect([200, 204]).toContain(delRes.status)
    const getRes = await api.get(`/api/users/${createdUser.id}`)
    expect(getRes.status).toBe(404)
  })

  it('should return 404 when getting a non-existent user', async () => {
    const response = await api.get('/api/users/999999')
    expect(response.status).toBe(404)
  })

  it('should return error when trying to create a user with duplicate email', async () => {
    const userDto = {
      name: 'Another User',
      email: 'frontend-test@example.com',
      password: 'outrasenha',
    }
    const first = await api.post('/api/users').send(userDto)
    expect(first.status).toBe(201)
    expectUserShape(first.body)
    const second = await api.post('/api/users').send(userDto)
    expect(second.status).toBe(409)
  })
})
