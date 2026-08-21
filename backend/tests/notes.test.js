const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const db = require('../config/db');

describe('Notes API', () => {
  const testEmail = `notesuser_${Date.now()}@example.com`;
  const testPassword = 'test123';
  let token;
  let createdNoteId;

  before(async () => {
    // Create a user and log in to get a token for authenticated requests
    await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Notes Tester', email: testEmail, password: testPassword });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: testPassword });

    token = loginRes.body.token;
  });

  after(async () => {
    await db.query('DELETE FROM users WHERE email = ?', [testEmail]);
    // notes get cleaned up automatically via ON DELETE CASCADE
  });

  it('should reject requests without a token', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.status).to.equal(401);
  });

  it('should create a new note', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Note', content: 'Some content' });

    expect(res.status).to.equal(201);
    expect(res.body.note).to.have.property('id');
    createdNoteId = res.body.note.id;
  });

  it('should reject creating a note without a title', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'No title here' });

    expect(res.status).to.equal(400);
  });

  it('should list notes for the logged-in user', async () => {
    const res = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.notes).to.be.an('array');
    expect(res.body.notes.length).to.be.greaterThan(0);
  });

  it('should get a single note by id', async () => {
    const res = await request(app)
      .get(`/api/notes/${createdNoteId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.note.id).to.equal(createdNoteId);
  });

  it('should return 404 for a note that does not exist', async () => {
    const res = await request(app)
      .get('/api/notes/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(404);
  });

  it('should update a note', async () => {
    const res = await request(app)
      .put(`/api/notes/${createdNoteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title', content: 'Updated content' });

    expect(res.status).to.equal(200);
    expect(res.body.note.title).to.equal('Updated Title');
  });

  it('should reject updating a note without a title', async () => {
    const res = await request(app)
      .put(`/api/notes/${createdNoteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'No title provided' });

    expect(res.status).to.equal(400);
  });

  it('should delete a note', async () => {
    const res = await request(app)
      .delete(`/api/notes/${createdNoteId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
  });

  it('should return 404 when trying to fetch the deleted note', async () => {
    const res = await request(app)
      .get(`/api/notes/${createdNoteId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(404);
  });
});