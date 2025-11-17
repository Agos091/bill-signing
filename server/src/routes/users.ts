import { Router, type Request, type Response } from 'express';
import { db } from '../services/database.js';

const router = Router();

// GET /api/users - Lista todos os usuários
router.get('/', (req: Request, res: Response) => {
  try {
    const users = db.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// GET /api/users/current - Obtém o usuário atual
router.get('/current', (req: Request, res: Response) => {
  try {
    const user = db.getCurrentUser();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário atual' });
  }
});

// GET /api/users/:id - Obtém um usuário específico
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = db.getUserById(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

export default router;

