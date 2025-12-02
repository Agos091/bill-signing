import request from 'supertest';
import express from 'express';
import documentsRouter from '../documents';
import { supabaseAdmin } from '../../config/supabase';
import * as db from '../../services/supabaseDatabase';
import { createLLMProvider } from '../../services/llm/index';

// Mock do supabaseAdmin
jest.mock('../../config/supabase', () => ({
  supabaseAdmin: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  },
}));

// Mock do supabaseDatabase
jest.mock('../../services/supabaseDatabase');

// Mock do LLM provider
jest.mock('../../services/llm/index', () => ({
  createLLMProvider: jest.fn(),
}));

// Mock do authMiddleware
jest.mock('../../middleware/auth', () => ({
  authMiddleware: (req: express.Request, res: express.Response, next: express.NextFunction) => {
    req.user = {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      avatar: '👤',
    };
    next();
  },
}));

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

  describe('POST /api/documents/:id/analyze', () => {
    it('should return 400 when id is missing', async () => {
      const response = await request(app)
        .post('/api/documents//analyze');
      expect(response.status).toBe(400);
    });

    it('should return 404 for non-existent document', async () => {
      (db.getDocumentById as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/api/documents/non-existent/analyze');
      expect(response.status).toBe(404);
    });

    it('should analyze document successfully', async () => {
      const mockDocument = {
        id: 'doc-1',
        title: 'Test Document',
        description: 'Test Description',
        status: 'pending',
        createdBy: { id: 'user-1', name: 'User', email: 'user@test.com', avatar: '👤' },
        signatures: [],
      };

      const mockAnalysis = {
        summary: 'Test analysis',
        keyPoints: ['Point 1', 'Point 2'],
      };

      (db.getDocumentById as jest.Mock).mockResolvedValue(mockDocument);
      (createLLMProvider as jest.Mock).mockReturnValue({
        analyzeDocument: jest.fn().mockResolvedValue(mockAnalysis),
      });

      const response = await request(app)
        .post('/api/documents/doc-1/analyze');
      
      expect(response.status).toBe(200);
      expect(response.body.summary).toBe('Test analysis');
    });

    it('should return 400 when document has no content', async () => {
      const mockDocument = {
        id: 'doc-1',
        title: '',
        description: '',
        status: 'pending',
        createdBy: { id: 'user-1', name: 'User', email: 'user@test.com', avatar: '👤' },
        signatures: [],
      };

      (db.getDocumentById as jest.Mock).mockResolvedValue(mockDocument);

      const response = await request(app)
        .post('/api/documents/doc-1/analyze');
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Documento não possui conteúdo para análise');
    });
  });

  describe('POST /api/documents/:id/summary', () => {
    it('should return 404 for non-existent document', async () => {
      (db.getDocumentById as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/api/documents/non-existent/summary');
      expect(response.status).toBe(404);
    });

    it('should generate summary successfully', async () => {
      const mockDocument = {
        id: 'doc-1',
        title: 'Test Document',
        description: 'Test Description',
        status: 'pending',
        createdBy: { id: 'user-1', name: 'User', email: 'user@test.com', avatar: '👤' },
        signatures: [],
      };

      const mockSummary = 'This is a summary';

      (db.getDocumentById as jest.Mock).mockResolvedValue(mockDocument);
      (createLLMProvider as jest.Mock).mockReturnValue({
        generateSummary: jest.fn().mockResolvedValue(mockSummary),
      });

      const response = await request(app)
        .post('/api/documents/doc-1/summary');
      
      expect(response.status).toBe(200);
      expect(response.body.summary).toBe(mockSummary);
    });
  });

  describe('POST /api/documents/:id/suggestions', () => {
    it('should return 404 for non-existent document', async () => {
      (db.getDocumentById as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/api/documents/non-existent/suggestions');
      expect(response.status).toBe(404);
    });

    it('should generate suggestions successfully', async () => {
      const mockDocument = {
        id: 'doc-1',
        title: 'Test Document',
        description: 'Test Description',
        status: 'pending',
        createdBy: { id: 'user-1', name: 'User', email: 'user@test.com', avatar: '👤' },
        signatures: [],
      };

      const mockSuggestions = ['Suggestion 1', 'Suggestion 2'];

      (db.getDocumentById as jest.Mock).mockResolvedValue(mockDocument);
      (createLLMProvider as jest.Mock).mockReturnValue({
        suggestImprovements: jest.fn().mockResolvedValue(mockSuggestions),
      });

      const response = await request(app)
        .post('/api/documents/doc-1/suggestions');
      
      expect(response.status).toBe(200);
      expect(response.body.suggestions).toEqual(mockSuggestions);
    });
  });

  describe('POST /api/documents/:id/compliance', () => {
    it('should return 404 for non-existent document', async () => {
      (db.getDocumentById as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/api/documents/non-existent/compliance')
        .send({ rules: [] });
      expect(response.status).toBe(404);
    });

    it('should check compliance successfully', async () => {
      const mockDocument = {
        id: 'doc-1',
        title: 'Test Document',
        description: 'Test Description',
        status: 'pending',
        createdBy: { id: 'user-1', name: 'User', email: 'user@test.com', avatar: '👤' },
        signatures: [],
      };

      const mockCompliance = {
        compliant: true,
        issues: [],
      };

      (db.getDocumentById as jest.Mock).mockResolvedValue(mockDocument);
      (createLLMProvider as jest.Mock).mockReturnValue({
        checkCompliance: jest.fn().mockResolvedValue(mockCompliance),
      });

      const response = await request(app)
        .post('/api/documents/doc-1/compliance')
        .send({ rules: ['Rule 1', 'Rule 2'] });
      
      expect(response.status).toBe(200);
      expect(response.body.compliant).toBe(true);
    });
  });

  describe('Error handling', () => {
    it('should handle errors when getting documents', async () => {
      (db.getAllDocuments as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/documents');
      expect(response.status).toBe(500);
    });

    it('should handle errors when creating document', async () => {
      (db.createDocument as jest.Mock).mockRejectedValue(new Error('Creation error'));

      const newDoc = {
        title: 'Test Document',
        description: 'Test Description',
        signatures: [{ userName: 'John', userEmail: 'john@test.com' }],
      };

      const response = await request(app).post('/api/documents').send(newDoc);
      expect(response.status).toBe(500);
    });

    it('should handle errors when updating document', async () => {
      (db.updateDocument as jest.Mock).mockRejectedValue(new Error('Update error'));

      const response = await request(app)
        .put('/api/documents/doc-1')
        .send({ title: 'Updated' });
      expect(response.status).toBe(500);
    });

    it('should handle errors when deleting document', async () => {
      (db.deleteDocument as jest.Mock).mockRejectedValue(new Error('Delete error'));

      const response = await request(app).delete('/api/documents/doc-1');
      expect(response.status).toBe(500);
    });
  });
});

