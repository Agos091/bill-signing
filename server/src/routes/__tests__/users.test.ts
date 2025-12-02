import request from 'supertest';
import express from 'express';
import usersRouter from '../users';
import { supabaseAdmin } from '../../config/supabase';

// Mock do supabaseAdmin
jest.mock('../../config/supabase', () => ({
  supabaseAdmin: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  },
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
app.use('/api/users', usersRouter);

describe('Users Router', () => {
  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/users/current', () => {
    it('should return current user', async () => {
      const response = await request(app).get('/api/users/current');
      expect(response.status).toBe(200);
      expect(response.body.id).toBeDefined();
      expect(response.body.email).toBeDefined();
      expect(response.body.name).toBeDefined();
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return 404 for non-existent user', async () => {
      const response = await request(app).get('/api/users/non-existent');
      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });
  });
});

