import { Router, type Request, type Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import { upload } from '../middleware/upload.js';
import { fileProcessor } from '../services/fileProcessor.js';

const router = Router();

// POST /api/upload - Upload e processamento de arquivo
router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const { originalname, mimetype, buffer, size } = req.file;

    // Valida tamanho (10MB já validado pelo multer, mas verifica novamente)
    if (size > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'Arquivo muito grande. Tamanho máximo: 10MB' });
    }

    // Gera nome único para o arquivo
    const ext = originalname.substring(originalname.lastIndexOf('.'));
    const filename = `${uuidv4()}${ext}`;

    // Salva arquivo
    const filePath = await fileProcessor.saveFile(buffer, filename);

    // Processa arquivo (extrai conteúdo)
    const processed = await fileProcessor.processFile(filePath, originalname, mimetype);

    // Retorna informações do arquivo processado
    res.status(200).json({
      id: filename,
      filename: originalname,
      url: fileProcessor.getFileUrl(filename),
      content: processed.content,
      metadata: processed.metadata,
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Erro ao processar arquivo',
    });
  }
});

// GET /api/upload/:id - Obtém informações de um arquivo processado
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const filePath = path.join(process.cwd(), 'uploads', id);

    try {
      const stats = await import('fs/promises').then((fs) => fs.stat(filePath));
      res.json({
        id,
        url: fileProcessor.getFileUrl(id),
        size: stats.size,
      });
    } catch {
      res.status(404).json({ error: 'Arquivo não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar arquivo' });
  }
});

// DELETE /api/upload/:id - Deleta um arquivo
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const filePath = path.join(process.cwd(), 'uploads', id);

    try {
      await fileProcessor.deleteFile(filePath);
      res.status(204).send();
    } catch {
      res.status(404).json({ error: 'Arquivo não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar arquivo' });
  }
});

export default router;

