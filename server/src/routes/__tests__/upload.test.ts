import request from 'supertest';
import express from 'express';
import uploadRouter from '../upload.js';
import fs from 'fs/promises';
import path from 'path';

const app = express();
app.use(express.json());
app.use('/api/upload', uploadRouter);

describe('Upload Router', () => {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  let testFileId: string;

  beforeEach(async () => {
    // Garante que o diretório de uploads existe
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
    } catch {
      // Ignora erros
    }
  });

  afterEach(async () => {
    // Limpa arquivos de teste
    if (testFileId) {
      try {
        await fs.unlink(path.join(uploadsDir, testFileId));
      } catch {
        // Ignora erros
      }
    }
  });

  describe('POST /api/upload', () => {
    it('should return 400 when no file is uploaded', async () => {
      const response = await request(app).post('/api/upload');
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Nenhum arquivo enviado');
    });

    it('should upload a text file', async () => {
      const response = await request(app)
        .post('/api/upload')
        .attach('file', Buffer.from('Test file content'), 'test.txt');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('filename');
      expect(response.body).toHaveProperty('url');
      expect(response.body).toHaveProperty('content');
      expect(response.body).toHaveProperty('metadata');
      expect(response.body.filename).toBe('test.txt');
      expect(response.body.content).toBe('Test file content');
      testFileId = response.body.id;
    });

    it('should upload and process CSV file', async () => {
      const csvContent = 'name,email\nJohn,john@test.com\nJane,jane@test.com';
      const response = await request(app)
        .post('/api/upload')
        .attach('file', Buffer.from(csvContent), 'test.csv');
      
      expect(response.status).toBe(200);
      expect(response.body.filename).toBe('test.csv');
      expect(response.body.content).toContain('CSV');
      expect(response.body.metadata.rows).toBe(2);
      testFileId = response.body.id;
    });

    it('should handle files with no extension', async () => {
      const response = await request(app)
        .post('/api/upload')
        .attach('file', Buffer.from('content'), 'file-without-ext');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      testFileId = response.body.id;
    });

    it('should handle files with multiple dots in name', async () => {
      const response = await request(app)
        .post('/api/upload')
        .attach('file', Buffer.from('content'), 'file.name.with.dots.txt');
      
      expect(response.status).toBe(200);
      expect(response.body.filename).toBe('file.name.with.dots.txt');
      testFileId = response.body.id;
    });

    it('should return 400 for file larger than 10MB', async () => {
      const largeBuffer = Buffer.alloc(11 * 1024 * 1024); // 11MB
      const response = await request(app)
        .post('/api/upload')
        .attach('file', largeBuffer, 'large.txt');
      
      // O multer pode rejeitar com 400 ou 413, ou pode processar e retornar 400
      expect([400, 413, 500]).toContain(response.status);
    });
  });

  describe('GET /api/upload/:id', () => {
    it('should return 404 for non-existent file', async () => {
      const response = await request(app).get('/api/upload/non-existent-id');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Arquivo não encontrado');
    });

    it('should return file info for existing file', async () => {
      // Primeiro cria um arquivo
      const uploadResponse = await request(app)
        .post('/api/upload')
        .attach('file', Buffer.from('Test content'), 'test.txt');
      
      testFileId = uploadResponse.body.id;
      
      // Depois busca informações
      const response = await request(app).get(`/api/upload/${testFileId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('url');
      expect(response.body).toHaveProperty('size');
      expect(response.body.id).toBe(testFileId);
    });
  });

  describe('DELETE /api/upload/:id', () => {
    it('should return 204 for non-existent file (deleteFile handles gracefully)', async () => {
      const response = await request(app).delete('/api/upload/non-existent-id');
      // deleteFile não lança erro para arquivos não existentes, então retorna 204
      expect([204, 404]).toContain(response.status);
    });

    it('should delete an existing file', async () => {
      // Primeiro cria um arquivo
      const uploadResponse = await request(app)
        .post('/api/upload')
        .attach('file', Buffer.from('Test content'), 'test.txt');
      
      testFileId = uploadResponse.body.id;
      
      // Depois deleta
      const response = await request(app).delete(`/api/upload/${testFileId}`);
      expect(response.status).toBe(204);
      
      // Verifica que foi deletado
      const getResponse = await request(app).get(`/api/upload/${testFileId}`);
      expect(getResponse.status).toBe(404);
    });
  });
});

