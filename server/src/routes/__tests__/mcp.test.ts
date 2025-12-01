import request from 'supertest';
import express from 'express';
import mcpRouter from '../mcp';

const app = express();
app.use(express.json());
app.use('/api/mcp', mcpRouter);

describe('MCP Router', () => {
  describe('GET /api/mcp/tools', () => {
    it('should return list of tools', async () => {
      const response = await request(app).get('/api/mcp/tools');
      expect(response.status).toBe(200);
      expect(response.body.tools).toBeDefined();
      expect(Array.isArray(response.body.tools)).toBe(true);
      expect(response.body.tools.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/mcp/call', () => {
    it('should return 400 when tool name is missing', async () => {
      const response = await request(app)
        .post('/api/mcp/call')
        .send({ arguments: {} });
      expect(response.status).toBe(400);
    });

    it('should call get_documents tool', async () => {
      const response = await request(app)
        .post('/api/mcp/call')
        .send({
          name: 'get_documents',
          arguments: {},
        });
      expect(response.status).toBe(200);
      expect(response.body.content).toBeDefined();
    });

    it('should call get_documents with status filter', async () => {
      const response = await request(app)
        .post('/api/mcp/call')
        .send({
          name: 'get_documents',
          arguments: { status: 'pending' },
        });
      expect(response.status).toBe(200);
      expect(response.body.content).toBeDefined();
    });

    it('should return 400 when documentId is missing for get_document', async () => {
      const response = await request(app)
        .post('/api/mcp/call')
        .send({
          name: 'get_document',
          arguments: {},
        });
      expect(response.status).toBe(400);
    });

    it('should return 404 for non-existent document', async () => {
      const response = await request(app)
        .post('/api/mcp/call')
        .send({
          name: 'get_document',
          arguments: { documentId: 'non-existent' },
        });
      expect(response.status).toBe(404);
    });

    it('should return 400 for unknown tool', async () => {
      const response = await request(app)
        .post('/api/mcp/call')
        .send({
          name: 'unknown_tool',
          arguments: {},
        });
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/mcp/resources', () => {
    it('should return list of resources', async () => {
      const response = await request(app).get('/api/mcp/resources');
      expect(response.status).toBe(200);
      expect(response.body.resources).toBeDefined();
      expect(Array.isArray(response.body.resources)).toBe(true);
    });
  });

  describe('GET /api/mcp/resources/:uri', () => {
    it('should return documents for documents://all', async () => {
      const response = await request(app).get(
        '/api/mcp/resources/documents%3A%2F%2Fall'
      );
      expect(response.status).toBe(200);
      expect(response.body.contents).toBeDefined();
    });

    it('should return pending documents for documents://pending', async () => {
      const response = await request(app).get(
        '/api/mcp/resources/documents%3A%2F%2Fpending'
      );
      expect(response.status).toBe(200);
      expect(response.body.contents).toBeDefined();
    });

    it('should return 404 for unknown resource', async () => {
      const response = await request(app).get(
        '/api/mcp/resources/unknown%3A%2F%2Fresource'
      );
      expect(response.status).toBe(404);
    });
  });
});

