const request = require('supertest');
const { createApp } = require('../../src/app');

describe('EnergyHome API integration', () => {
  const app = createApp({
    useMemory: true,
    jwtSecret: 'integration-secret',
    bcryptRounds: 1,
  });

  it('registers a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Integration User', email: 'integration@energyhome.com', password: 'Password123!' });

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe('integration@energyhome.com');
    expect(response.body.token).toBeTruthy();
  });

  it('logs in an existing user', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Login User', email: 'login@energyhome.com', password: 'Password123!' });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@energyhome.com', password: 'Password123!' });

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe('login@energyhome.com');
  });

  it('handles appliance CRUD end to end', async () => {
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Crud User', email: 'crud@energyhome.com', password: 'Password123!' });

    const authHeader = { Authorization: `Bearer ${registerResponse.body.token}` };

    const createResponse = await request(app)
      .post('/api/appliances')
      .set(authHeader)
      .send({ name: 'Ventilador', powerWatts: 75, dailyHours: 6 });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.monthlyKwh).toBe(13.5);

    const listResponse = await request(app).get('/api/appliances').set(authHeader);
    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveLength(1);

    const updateResponse = await request(app)
      .put(`/api/appliances/${createResponse.body.id}`)
      .set(authHeader)
      .send({ name: 'Ventilador turbo', powerWatts: 90, dailyHours: 5 });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.monthlyKwh).toBe(13.5);

    const deleteResponse = await request(app)
      .delete(`/api/appliances/${createResponse.body.id}`)
      .set(authHeader);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual({ deleted: true });
  });
});