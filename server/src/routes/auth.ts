import { Router, type Request, type Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';

const router = Router();

// POST /api/auth/signup - Registrar novo usuário
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Confirma email automaticamente
      user_metadata: {
        name: name || email.split('@')[0],
        avatar: '👤',
      },
    });

    if (error) {
      console.error('Erro ao criar usuário:', error);
      if (error.message.includes('already')) {
        return res.status(400).json({ error: 'Este email já está cadastrado' });
      }
      return res.status(400).json({ error: error.message });
    }

    // Cria o profile automaticamente após criar o usuário
    if (data.user) {
      await supabaseAdmin
        .from('profiles')
        .upsert({
          id: data.user.id,
          name: name || email.split('@')[0],
          email: email,
          avatar: '👤',
        }, {
          onConflict: 'id',
        });
    }

    // Gera token de acesso
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
    });

    // Faz login para obter o token
    const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error('Erro ao fazer login após signup:', signInError);
      return res.status(500).json({ error: 'Usuário criado, mas erro ao gerar sessão' });
    }

    res.status(201).json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: name || email.split('@')[0],
        avatar: '👤',
      },
      session: {
        access_token: signInData.session?.access_token,
        refresh_token: signInData.session?.refresh_token,
        expires_at: signInData.session?.expires_at,
      },
    });
  } catch (error) {
    console.error('Erro no signup:', error);
    res.status(500).json({ error: 'Erro interno ao criar usuário' });
  }
});

// POST /api/auth/login - Login do usuário
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Erro no login:', error);
      if (error.message.includes('Invalid login')) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }
      return res.status(401).json({ error: error.message });
    }

    // Busca ou cria dados do profile
    let profile = null;
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    // Se profile não existe, cria automaticamente
    if (!profileData && data.user) {
      const { data: newProfile, error: createError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: data.user.id,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Usuário',
          email: data.user.email || '',
          avatar: data.user.user_metadata?.avatar || '👤',
        })
        .select()
        .single();

      if (!createError && newProfile) {
        profile = newProfile;
      }
    } else {
      profile = profileData;
    }

    res.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || data.user.user_metadata?.name || data.user.email?.split('@')[0],
        avatar: profile?.avatar || '👤',
      },
      session: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        expires_at: data.session?.expires_at,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno ao fazer login' });
  }
});

// POST /api/auth/logout - Logout do usuário
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      await supabaseAdmin.auth.admin.signOut(token);
    }

    res.json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({ error: 'Erro ao fazer logout' });
  }
});

// GET /api/auth/me - Obtém dados do usuário atual
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    // Busca ou cria dados do profile
    let profile = null;
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    // Se profile não existe, cria automaticamente
    if (!profileData && user) {
      const { data: newProfile, error: createError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
          email: user.email || '',
          avatar: user.user_metadata?.avatar || '👤',
        })
        .select()
        .single();

      if (!createError && newProfile) {
        profile = newProfile;
      }
    } else {
      profile = profileData;
    }

    res.json({
      id: user.id,
      email: user.email,
      name: profile?.name || user.user_metadata?.name || user.email?.split('@')[0],
      avatar: profile?.avatar || '👤',
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do usuário' });
  }
});

// POST /api/auth/refresh - Renova o token
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ error: 'Refresh token é obrigatório' });
    }

    const { data, error } = await supabaseAdmin.auth.refreshSession({
      refresh_token,
    });

    if (error) {
      return res.status(401).json({ error: 'Token expirado ou inválido' });
    }

    res.json({
      session: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        expires_at: data.session?.expires_at,
      },
    });
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    res.status(500).json({ error: 'Erro ao renovar token' });
  }
});

export default router;

