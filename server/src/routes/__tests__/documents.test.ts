import request from 'supertest';
import express from 'express';
import documentsRouter from '../documents';

const app = express();
app.use(express.json());
app.use('/api/documents', documentsRouter);

describe('Documents Router', () => {
  describe('GET /api/documents', () => {
    it('should return all documents', async () => {
      const response = await request(app).get('/api/documents');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter documents by status', async () => {
      const response = await request(app).get('/api/documents?status=pending');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/documents/:id', () => {
    it('should return 404 for non-existent document', async () => {
      const response = await request(app).get('/api/documents/non-existent');
      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /api/documents', () => {
    it('should create a new document with valid data', async () => {
      const newDoc = {
        title: 'Test Document',
        description: 'Test Description',
        signatures: [
          { userName: 'John Doe', userEmail: 'john@example.com' },
        ],
      };
      const response = await request(app).post('/api/documents').send(newDoc);
      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Test Document');
    });

    it('should return 400 when title is missing', async () => {
      const newDoc = {
        description: 'Test Description',
        signatures: [],
      };
      const response = await request(app).post('/api/documents').send(newDoc);
      expect(response.status).toBe(400);
    });

    it('should return 400 when description is missing', async () => {
      const newDoc = {
        title: 'Test Document',
        signatures: [],
      };
      const response = await request(app).post('/api/documents').send(newDoc);
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/documents/:id', () => {
    it('should return 404 for non-existent document', async () => {
      const response = await request(app)
        .put('/api/documents/non-existent')
        .send({ title: 'Updated' });
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/documents/:id', () => {
    it('should return 404 for non-existent document', async () => {
      const response = await request(app).delete('/api/documents/non-existent');
      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/documents/:id/sign', () => {
    it('should return 404 for non-existent document', async () => {
      const response = await request(app)
        .post('/api/documents/non-existent/sign')
        .send({ signatureId: 'sig-1' });
      expect(response.status).toBe(404);
    });

    it('should return 400 when signatureId is missing', async () => {
      const response = await request(app)
        .post('/api/documents/test-id/sign')
        .send({});
      expect(response.status).toBe(400);
    });
  });
});

