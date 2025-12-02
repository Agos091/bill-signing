import { Router, type Request, type Response } from 'express';
import * as db from '../services/supabaseDatabase.js';
import { createLLMProvider } from '../services/llm/index.js';
import { authMiddleware } from '../middleware/auth.js';
import type { CreateDocumentData } from '../types/index.js';

const router = Router();

function getLLMProvider() {
  return createLLMProvider();
}

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// GET /api/documents - Lista documentos do usuário logado
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const userId = req.user!.id;
    
    // Busca apenas documentos criados pelo usuário logado
    let documents = await db.getAllDocuments(userId);

    if (status && typeof status === 'string') {
      documents = documents.filter((doc) => doc.status === status);
    }

    res.json(documents);
  } catch (error) {
    console.error('Erro ao buscar documentos:', error);
    res.status(500).json({ error: 'Erro ao buscar documentos' });
  }
});

// GET /api/documents/:id - Obtém um documento específico
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const document = await db.getDocumentById(id);

    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    // Verifica se o documento pertence ao usuário logado
    if (document.createdBy.id !== userId) {
      return res.status(403).json({ error: 'Acesso negado: este documento não pertence a você' });
    }

    res.json(document);
  } catch (error) {
    console.error('Erro ao buscar documento:', error);
    res.status(500).json({ error: 'Erro ao buscar documento' });
  }
});

// POST /api/documents - Cria um novo documento
router.post('/', async (req: Request, res: Response) => {
  try {
    const data: CreateDocumentData = req.body;
    const userId = req.user!.id;

    if (!data.title || !data.description) {
      return res.status(400).json({ error: 'Título e descrição são obrigatórios' });
    }

    if (!data.signatures || data.signatures.length === 0) {
      return res.status(400).json({ error: 'Pelo menos uma assinatura é obrigatória' });
    }

    const newDocument = await db.createDocument(
      {
        title: data.title,
        description: data.description,
        status: 'pending',
        fileUrl: data.fileUrl,
        expiresAt: data.expiresAt,
        createdBy: req.user!,
        signatures: data.signatures.map((sig) => ({
          id: '',
          userId: '',
          userName: sig.userName,
          userEmail: sig.userEmail,
          status: 'pending' as const,
        })),
      },
      userId
    );

    res.status(201).json(newDocument);
  } catch (error) {
    console.error('Erro ao criar documento:', error);
    res.status(500).json({ error: 'Erro ao criar documento' });
  }
});

// PUT /api/documents/:id - Atualiza um documento
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const updates = req.body;

    // Verifica se o documento existe e pertence ao usuário
    const document = await db.getDocumentById(id);
    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    if (document.createdBy.id !== userId) {
      return res.status(403).json({ error: 'Acesso negado: este documento não pertence a você' });
    }

    const updated = await db.updateDocument(id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Erro ao atualizar documento:', error);
    res.status(500).json({ error: 'Erro ao atualizar documento' });
  }
});

// DELETE /api/documents/:id - Deleta um documento
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Verifica se o documento existe e pertence ao usuário
    const document = await db.getDocumentById(id);
    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    if (document.createdBy.id !== userId) {
      return res.status(403).json({ error: 'Acesso negado: este documento não pertence a você' });
    }

    const deleted = await db.deleteDocument(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar documento:', error);
    res.status(500).json({ error: 'Erro ao deletar documento' });
  }
});

// POST /api/documents/:id/sign - Assina um documento
router.post('/:id/sign', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { signatureId, comment } = req.body;
    const userEmail = req.user!.email;

    if (!signatureId) {
      return res.status(400).json({ error: 'signatureId é obrigatório' });
    }

    // Verifica se o documento existe
    const document = await db.getDocumentById(id);
    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    // Verifica se o usuário está na lista de signatários
    const signature = document.signatures.find((sig) => sig.id === signatureId);
    if (!signature) {
      return res.status(404).json({ error: 'Assinatura não encontrada' });
    }

    // Verifica se o email do usuário corresponde ao signatário
    if (signature.userEmail !== userEmail) {
      return res.status(403).json({ error: 'Acesso negado: você não está autorizado a assinar este documento' });
    }

    const signedDocument = await db.signDocument(id, signatureId, comment);
    
    if (!signedDocument) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    res.json(signedDocument);
  } catch (error) {
    console.error('Erro ao assinar documento:', error);
    res.status(500).json({ error: 'Erro ao assinar documento' });
  }
});

// POST /api/documents/:id/analyze - Analisa um documento com LLM
router.post('/:id/analyze', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    if (!id) {
      return res.status(400).json({ error: 'ID do documento é obrigatório' });
    }

    const document = await db.getDocumentById(id);

    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    // Verifica se o documento pertence ao usuário logado
    if (document.createdBy.id !== userId) {
      return res.status(403).json({ error: 'Acesso negado: este documento não pertence a você' });
    }

    const content = `${document.title}\n\n${document.description}`;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Documento não possui conteúdo para análise' });
    }

    const analysis = await getLLMProvider().analyzeDocument(content);

    res.json(analysis);
  } catch (error) {
    console.error('Erro ao analisar documento:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    res.status(500).json({
      error: 'Erro ao analisar documento',
      details: errorMessage,
    });
  }
});

// POST /api/documents/:id/summary - Gera resumo do documento
router.post('/:id/summary', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const document = await db.getDocumentById(id);

    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    // Verifica se o documento pertence ao usuário logado
    if (document.createdBy.id !== userId) {
      return res.status(403).json({ error: 'Acesso negado: este documento não pertence a você' });
    }

    const content = `${document.title}\n\n${document.description}`;
    const summary = await getLLMProvider().generateSummary(content);

    res.json({ summary });
  } catch (error) {
    console.error('Erro ao gerar resumo:', error);
    res.status(500).json({ error: 'Erro ao gerar resumo' });
  }
});

// POST /api/documents/:id/suggestions - Gera sugestões de melhorias
router.post('/:id/suggestions', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const document = await db.getDocumentById(id);

    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    // Verifica se o documento pertence ao usuário logado
    if (document.createdBy.id !== userId) {
      return res.status(403).json({ error: 'Acesso negado: este documento não pertence a você' });
    }

    const content = `${document.title}\n\n${document.description}`;
    const suggestions = await getLLMProvider().suggestImprovements(content);

    res.json({ suggestions });
  } catch (error) {
    console.error('Erro ao gerar sugestões:', error);
    res.status(500).json({ error: 'Erro ao gerar sugestões' });
  }
});

// POST /api/documents/:id/compliance - Verifica conformidade
router.post('/:id/compliance', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { rules } = req.body;
    const document = await db.getDocumentById(id);

    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    // Verifica se o documento pertence ao usuário logado
    if (document.createdBy.id !== userId) {
      return res.status(403).json({ error: 'Acesso negado: este documento não pertence a você' });
    }

    const content = `${document.title}\n\n${document.description}`;
    const compliance = await getLLMProvider().checkCompliance(content, rules);

    res.json(compliance);
  } catch (error) {
    console.error('Erro ao verificar conformidade:', error);
    res.status(500).json({ error: 'Erro ao verificar conformidade' });
  }
});

export default router;
