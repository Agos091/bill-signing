import { Router, type Request, type Response } from 'express';
import * as db from '../services/supabaseDatabase.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// GET /api/users - Lista todos os usuários
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await db.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// GET /api/users/current - Obtém o usuário atual
router.get('/current', (req: Request, res: Response) => {
  try {
    // O usuário já está no req.user pelo middleware
    res.json(req.user);
  } catch (error) {
    console.error('Erro ao buscar usuário atual:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário atual' });
  }
});

// GET /api/users/:id - Obtém um usuário específico
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await db.getUserById(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

export default router;
