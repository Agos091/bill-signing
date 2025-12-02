import { Request, Response, NextFunction } from 'express';
import { authMiddleware, optionalAuthMiddleware } from '../auth';
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

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockRequest = {
      headers: {},
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    
    nextFunction = jest.fn();
  });

  describe('authMiddleware', () => {
    it('should return 401 when authorization header is missing', async () => {
      await authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Token não fornecido' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 when token is invalid', async () => {
      mockRequest.headers = {
        authorization: 'Bearer invalid-token',
      };

      (supabaseAdmin.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid token' },
      });

      await authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Token inválido ou expirado' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should set user in request when token is valid', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      };
      const mockProfile = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        avatar: '👤',
      };

      mockRequest.headers = {
        authorization: 'Bearer valid-token',
      };

      (supabaseAdmin.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabaseAdmin.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockProfile,
          error: null,
        }),
      });

      await authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.user).toBeDefined();
      expect(mockRequest.user?.id).toBe('user-123');
      expect(mockRequest.user?.email).toBe('test@example.com');
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should use email as name when profile is not found', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      };

      mockRequest.headers = {
        authorization: 'Bearer valid-token',
      };

      (supabaseAdmin.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabaseAdmin.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      });

      await authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.user?.name).toBe('test');
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 500 on unexpected error', async () => {
      mockRequest.headers = {
        authorization: 'Bearer valid-token',
      };

      (supabaseAdmin.auth.getUser as jest.Mock).mockRejectedValue(
        new Error('Unexpected error')
      );

      await authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Erro de autenticação' });
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuthMiddleware', () => {
    it('should call next when authorization header is missing', async () => {
      await optionalAuthMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockRequest.user).toBeUndefined();
    });

    it('should set user when token is valid', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      };
      const mockProfile = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        avatar: '👤',
      };

      mockRequest.headers = {
        authorization: 'Bearer valid-token',
      };

      (supabaseAdmin.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabaseAdmin.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockProfile,
          error: null,
        }),
      });

      await optionalAuthMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.user).toBeDefined();
      expect(mockRequest.user?.id).toBe('user-123');
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should continue without user when token is invalid', async () => {
      mockRequest.headers = {
        authorization: 'Bearer invalid-token',
      };

      (supabaseAdmin.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid token' },
      });

      await optionalAuthMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.user).toBeUndefined();
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should continue on error', async () => {
      mockRequest.headers = {
        authorization: 'Bearer valid-token',
      };

      (supabaseAdmin.auth.getUser as jest.Mock).mockRejectedValue(
        new Error('Unexpected error')
      );

      await optionalAuthMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
    });
  });
});

