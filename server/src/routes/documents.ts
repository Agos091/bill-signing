import { Router, type Request, type Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../services/database.js';
import { createLLMProvider } from '../services/llm/index.js';
import type { CreateDocumentData, Document } from '../types/index.js';

const router = Router();

function getLLMProvider() {
  return createLLMProvider();
}

// GET /api/documents - Lista todos os documentos
router.get('/', (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    let documents = db.getAllDocuments();

    if (status && typeof status === 'string') {
      documents = documents.filter((doc) => doc.status === status);
    }

    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar documentos' });
  }
});

// GET /api/documents/:id - Obtém um documento específico
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const document = db.getDocumentById(id);

    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar documento' });
  }
});

// POST /api/documents - Cria um novo documento
router.post('/', (req: Request, res: Response) => {
  try {
    const data: CreateDocumentData = req.body;

    if (!data.title || !data.description) {
      return res.status(400).json({ error: 'Título e descrição são obrigatórios' });
    }

    const currentUser = db.getCurrentUser();
    const newDocument: Document = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt: data.expiresAt,
      fileUrl: data.fileUrl,
      createdBy: currentUser,
      signatures: data.signatures.map((sig, idx) => ({
        id: `sig-${Date.now()}-${idx}`,
        userId: '',
        userName: sig.userName,
        userEmail: sig.userEmail,
        status: 'pending' as const,
      })),
    };

    const created = db.createDocument(newDocument);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar documento' });
  }
});

// PUT /api/documents/:id - Atualiza um documento
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = db.updateDocument(id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar documento' });
  }
});

// DELETE /api/documents/:id - Deleta um documento
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteDocument(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar documento' });
  }
});

// POST /api/documents/:id/sign - Assina um documento
router.post('/:id/sign', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { signatureId, comment } = req.body;

    if (!signatureId) {
      return res.status(400).json({ error: 'signatureId é obrigatório' });
    }

    const document = db.getDocumentById(id);
    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    const signatureIndex = document.signatures.findIndex((sig) => sig.id === signatureId);
    if (signatureIndex === -1) {
      return res.status(404).json({ error: 'Assinatura não encontrada' });
    }

    document.signatures[signatureIndex] = {
      ...document.signatures[signatureIndex],
      status: 'signed',
      signedAt: new Date().toISOString(),
      comment,
    };

    // Verifica se todas as assinaturas foram concluídas
    const allSigned = document.signatures.every((sig) => sig.status === 'signed');
    if (allSigned) {
      document.status = 'signed';
    }

    const updated = db.updateDocument(id, document);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao assinar documento' });
  }
});

// POST /api/documents/:id/analyze - Analisa um documento com LLM
router.post('/:id/analyze', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'ID do documento é obrigatório' });
    }

    const document = db.getDocumentById(id);

    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    // Prepara o conteúdo para análise
    const content = `${document.title}\n\n${document.description}`;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Documento não possui conteúdo para análise' });
    }

    // Analisa o documento usando LLM
    const analysis = await getLLMProvider().analyzeDocument(content);

    res.json(analysis);
  } catch (error) {
    console.error('Erro ao analisar documento:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    res.status(500).json({ 
      error: 'Erro ao analisar documento',
      details: errorMessage 
    });
  }
});

// POST /api/documents/:id/summary - Gera resumo do documento
router.post('/:id/summary', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const document = db.getDocumentById(id);

    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado' });
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
    const document = db.getDocumentById(id);

    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado' });
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
    const { rules } = req.body;
    const document = db.getDocumentById(id);

    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado' });
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

