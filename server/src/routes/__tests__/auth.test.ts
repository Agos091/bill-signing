import request from 'supertest';
import express from 'express';
import authRouter from '../auth';
import { supabaseAdmin } from '../../config/supabase';

// Mock do supabaseAdmin
jest.mock('../../config/supabase', () => ({
  supabaseAdmin: {
    auth: {
      admin: {
        createUser: jest.fn(),
        generateLink: jest.fn(),
        signOut: jest.fn(),
      },
      signInWithPassword: jest.fn(),
      getUser: jest.fn(),
      refreshSession: jest.fn(),
    },
    from: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

describe('Auth Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    it('should return 400 when email is missing', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ password: 'password123' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email e senha são obrigatórios');
    });

    it('should return 400 when password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@example.com' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email e senha são obrigatórios');
    });

    it('should return 400 when password is too short', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@example.com', password: '12345' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Senha deve ter pelo menos 6 caracteres');
    });

    it('should return 400 when email already exists', async () => {
      (supabaseAdmin.auth.admin.createUser as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'User already registered' },
      });

      const response = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@example.com', password: 'password123' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Este email já está cadastrado');
    });

    it('should create user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      };
      const mockSession = {
        access_token: 'token-123',
        refresh_token: 'refresh-123',
        expires_at: 1234567890,
      };

      (supabaseAdmin.auth.admin.createUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabaseAdmin.auth.admin.generateLink as jest.Mock).mockResolvedValue({
        data: { properties: {} },
        error: null,
      });

      const upsertChain = {
        upsert: jest.fn().mockResolvedValue({ data: null, error: null }),
      };

      (supabaseAdmin.from as jest.Mock).mockReturnValue(upsertChain);

      (supabaseAdmin.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const response = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@example.com', password: 'password123', name: 'Test User' });
      
      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.session.access_token).toBe('token-123');
    });

    it('should return 500 when signIn fails after user creation', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      };

      (supabaseAdmin.auth.admin.createUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const upsertChain = {
        upsert: jest.fn().mockResolvedValue({ data: null, error: null }),
      };

      (supabaseAdmin.from as jest.Mock).mockReturnValue(upsertChain);

      (supabaseAdmin.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Sign in failed' },
      });

      const response = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@example.com', password: 'password123' });
      
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Usuário criado, mas erro ao gerar sessão');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 when email is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ password: 'password123' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email e senha são obrigatórios');
    });

    it('should return 400 when password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email e senha são obrigatórios');
    });

    it('should return 401 when credentials are invalid', async () => {
      (supabaseAdmin.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Invalid login credentials' },
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Email ou senha incorretos');
    });

    it('should login successfully with existing profile', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: { name: 'Test User' },
      };
      const mockSession = {
        access_token: 'token-123',
        refresh_token: 'refresh-123',
        expires_at: 1234567890,
      };
      const mockProfile = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        avatar: '👤',
      };

      (supabaseAdmin.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      (supabaseAdmin.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({
          data: mockProfile,
          error: null,
        }),
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });
      
      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.session.access_token).toBe('token-123');
    });

    it('should create profile if it does not exist', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: { name: 'Test User' },
      };
      const mockSession = {
        access_token: 'token-123',
        refresh_token: 'refresh-123',
        expires_at: 1234567890,
      };
      const mockNewProfile = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        avatar: '👤',
      };

      (supabaseAdmin.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      let callCount = 0;
      (supabaseAdmin.from as jest.Mock).mockImplementation((table) => {
        if (table === 'profiles') {
          callCount++;
          if (callCount === 1) {
            // Primeira chamada: maybeSingle retorna null
            return {
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              maybeSingle: jest.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            };
          } else {
            // Segunda chamada: insert
            return {
              insert: jest.fn().mockReturnThis(),
              select: jest.fn().mockReturnThis(),
              single: jest.fn().mockResolvedValue({
                data: mockNewProfile,
                error: null,
              }),
            };
          }
        }
        return {};
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });
      
      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe('test@example.com');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      (supabaseAdmin.auth.admin.signOut as jest.Mock).mockResolvedValue({
        data: null,
        error: null,
      });

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer token-123');
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Logout realizado com sucesso');
    });

    it('should logout successfully without token', async () => {
      const response = await request(app)
        .post('/api/auth/logout');
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Logout realizado com sucesso');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 401 when token is missing', async () => {
      const response = await request(app)
        .get('/api/auth/me');
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Token não fornecido');
    });

    it('should return 401 when token is invalid', async () => {
      (supabaseAdmin.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid token' },
      });

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Token inválido');
    });

    it('should return user data successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: { name: 'Test User' },
      };
      const mockProfile = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        avatar: '👤',
      };

      (supabaseAdmin.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabaseAdmin.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({
          data: mockProfile,
          error: null,
        }),
      });

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer valid-token');
      
      expect(response.status).toBe(200);
      expect(response.body.email).toBe('test@example.com');
      expect(response.body.name).toBe('Test User');
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should return 400 when refresh_token is missing', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Refresh token é obrigatório');
    });

    it('should return 401 when refresh_token is invalid', async () => {
      (supabaseAdmin.auth.refreshSession as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Invalid refresh token' },
      });

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refresh_token: 'invalid-refresh-token' });
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Token expirado ou inválido');
    });

    it('should refresh token successfully', async () => {
      const mockSession = {
        access_token: 'new-token-123',
        refresh_token: 'new-refresh-123',
        expires_at: 1234567890,
      };

      (supabaseAdmin.auth.refreshSession as jest.Mock).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refresh_token: 'valid-refresh-token' });
      
      expect(response.status).toBe(200);
      expect(response.body.session.access_token).toBe('new-token-123');
    });
  });
});

