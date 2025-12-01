import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase.js';

// Extende o tipo Request para incluir o usuário
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        avatar: string;
      };
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: 'Token não fornecido' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ error: 'Token inválido ou expirado' });
      return;
    }

    // Busca dados do profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    req.user = {
      id: user.id,
      email: user.email || '',
      name: profile?.name || user.email?.split('@')[0] || 'Usuário',
      avatar: profile?.avatar || '👤',
    };

    next();
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    res.status(500).json({ error: 'Erro de autenticação' });
  }
}

// Middleware opcional - não bloqueia se não houver token
export async function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      next();
      return;
    }

    const token = authHeader.replace('Bearer ', '');

    const { data: { user } } = await supabaseAdmin.auth.getUser(token);

    if (user) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      req.user = {
        id: user.id,
        email: user.email || '',
        name: profile?.name || user.email?.split('@')[0] || 'Usuário',
        avatar: profile?.avatar || '👤',
      };
    }

    next();
  } catch (error) {
    // Ignora erros e continua sem usuário
    next();
  }
}

