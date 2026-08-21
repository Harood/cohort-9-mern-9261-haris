const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const db = require('../config/db');

describe('Auth API', () => {
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = 'test123';

  after(async () => {
    // Clean up the test user created during these tests
    await db.query('DELETE FROM users WHERE email = ?', [testEmail]);
  });

  describe('POST /api/auth/signup', () => {
    it('should register a new user with valid data', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test User', email: testEmail, password: testPassword });

      expect(res.status).to.equal(201);
      expect(res.body.success).to.be.true;
      expect(res.body.user).to.have.property('id');
      expect(res.body.user.email).to.equal(testEmail);
    });

    it('should reject signup with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'incomplete@example.com' });

      expect(res.status).to.equal(400);
      expect(res.body.success).to.be.false;
    });

    it('should reject duplicate email signup', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Duplicate', email: testEmail, password: testPassword });

      expect(res.status).to.equal(409);
      expect(res.body.message).to.match(/already registered/i);
    });

    it('should reject a password shorter than 6 characters', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Short Pass', email: `short_${Date.now()}@example.com`, password: '123' });

      expect(res.status).to.equal(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should log in with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail, password: testPassword });

      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.token).to.be.a('string');
      expect(res.body.user.email).to.equal(testEmail);
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail, password: 'wrongpassword' });

      expect(res.status).to.equal(401);
    });

    it('should reject login for a non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'doesnotexist@example.com', password: 'whatever' });

      expect(res.status).to.equal(401);
    });

    it('should reject login with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail });

      expect(res.status).to.equal(400);
    });
  });
});