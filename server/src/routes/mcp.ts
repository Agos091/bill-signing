import { Router, type Request, type Response } from 'express';
import { db } from '../services/database.js';
import { createLLMProvider } from '../services/llm/index.js';

const router = Router();

// Lazy initialization do LLM provider
let llmProvider: ReturnType<typeof createLLMProvider> | null = null;

function getLLMProvider() {
  if (!llmProvider) {
    try {
      llmProvider = createLLMProvider();
    } catch (error) {
      console.error('Erro ao inicializar LLM provider:', error);
      throw error;
    }
  }
  return llmProvider;
}

// GET /api/mcp/tools - Lista todas as ferramentas disponíveis
router.get('/tools', (req: Request, res: Response) => {
  res.json({
    tools: [
      {
        name: 'get_documents',
        description: 'Lista todos os documentos do sistema de assinatura',
        inputSchema: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['pending', 'signed', 'rejected', 'expired'],
              description: 'Filtrar documentos por status (opcional)',
            },
          },
        },
      },
      {
        name: 'get_document',
        description: 'Obtém detalhes de um documento específico por ID',
        inputSchema: {
          type: 'object',
          properties: {
            documentId: {
              type: 'string',
              description: 'ID do documento',
            },
          },
          required: ['documentId'],
        },
      },
      {
        name: 'analyze_document',
        description: 'Analisa um documento usando LLM para extrair insights, pontos-chave e sugestões',
        inputSchema: {
          type: 'object',
          properties: {
            documentId: {
              type: 'string',
              description: 'ID do documento a ser analisado',
            },
          },
          required: ['documentId'],
        },
      },
      {
        name: 'generate_document_summary',
        description: 'Gera um resumo inteligente de um documento usando LLM',
        inputSchema: {
          type: 'object',
          properties: {
            documentId: {
              type: 'string',
              description: 'ID do documento',
            },
          },
          required: ['documentId'],
        },
      },
      {
        name: 'suggest_document_improvements',
        description: 'Sugere melhorias para um documento usando análise de LLM',
        inputSchema: {
          type: 'object',
          properties: {
            documentId: {
              type: 'string',
              description: 'ID do documento',
            },
          },
          required: ['documentId'],
        },
      },
      {
        name: 'check_document_compliance',
        description: 'Verifica conformidade de um documento com regras específicas usando LLM',
        inputSchema: {
          type: 'object',
          properties: {
            documentId: {
              type: 'string',
              description: 'ID do documento',
            },
            rules: {
              type: 'array',
              items: { type: 'string' },
              description: 'Lista de regras de conformidade a verificar (opcional)',
            },
          },
          required: ['documentId'],
        },
      },
      {
        name: 'get_pending_signatures',
        description: 'Lista todas as assinaturas pendentes no sistema',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_user_documents',
        description: 'Lista documentos criados por um usuário específico',
        inputSchema: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              description: 'ID do usuário',
            },
          },
          required: ['userId'],
        },
      },
    ],
  });
});

// POST /api/mcp/call - Chama uma ferramenta MCP
router.post('/call', async (req: Request, res: Response) => {
  try {
    const { name, arguments: args } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({
        error: 'Nome da ferramenta é obrigatório',
        isError: true,
      });
    }

    let result: any;

    switch (name) {
      case 'get_documents': {
        let documents = db.getAllDocuments();
        if (args?.status) {
          documents = documents.filter((doc) => doc.status === args.status);
        }
        result = {
          content: [
            {
              type: 'text',
              text: JSON.stringify(documents, null, 2),
            },
          ],
        };
        break;
      }

      case 'get_document': {
        const documentId = typeof args?.documentId === 'string' ? args.documentId : undefined;
        if (!documentId) {
          return res.status(400).json({
            content: [
              {
                type: 'text',
                text: JSON.stringify({ error: 'documentId é obrigatório' }),
              },
            ],
            isError: true,
          });
        }
        const document = db.getDocumentById(documentId);
        if (!document) {
          return res.status(404).json({
            content: [
              {
                type: 'text',
                text: JSON.stringify({ error: 'Documento não encontrado' }),
              },
            ],
            isError: true,
          });
        }
        result = {
          content: [
            {
              type: 'text',
              text: JSON.stringify(document, null, 2),
            },
          ],
        };
        break;
      }

      case 'analyze_document': {
        const documentId = typeof args?.documentId === 'string' ? args.documentId : undefined;
        if (!documentId) {
          return res.status(400).json({
            content: [
              {
                type: 'text',
                text: JSON.stringify({ error: 'documentId é obrigatório' }),
              },
            ],
            isError: true,
          });
        }
        const document = db.getDocumentById(documentId);
        if (!document) {
          return res.status(404).json({
            content: [
              {
                type: 'text',
                text: JSON.stringify({ error: 'Documento não encontrado' }),
              },
            ],
            isError: true,
          });
        }

        const content = `${document.title}\n\n${document.description}`;
        const analysis = await getLLMProvider().analyzeDocument(content);

        result = {
          content: [
            {
              type: 'text',
              text: JSON.stringify(analysis, null, 2),
            },
          ],
        };
        break;
      }

      case 'generate_document_summary': {
        const documentId = typeof args?.documentId === 'string' ? args.documentId : undefined;
        if (!documentId) {
          return res.status(400).json({
            content: [
              {
                type: 'text',
                text: JSON.stringify({ error: 'documentId é obrigatório' }),
              },
            ],
            isError: true,
          });
        }
        const document = db.getDocumentById(documentId);
        if (!document) {
          return res.status(404).json({
            content: [
              {
                type: 'text',
                text: JSON.stringify({ error: 'Documento não encontrado' }),
              },
            ],
            isError: true,
          });
        }

        const content = `${document.title}\n\n${document.description}`;
        const summary = await getLLMProvider().generateSummary(content);

        result = {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ summary }, null, 2),
            },
          ],
        };
        break;
      }

      case 'suggest_document_improvements': {
        const documentId = typeof args?.documentId === 'string' ? args.documentId : undefined;
        if (!documentId) {
          return res.status(400).json({
            content: [
              {
                type: 'text',
                text: JSON.stringify({ error: 'documentId é obrigatório' }),
              },
            ],
            isError: true,
          });
        }
        const document = db.getDocumentById(documentId);
        if (!document) {
          return res.status(404).json({
            content: [
              {
                type: 'text',
                text: JSON.stringify({ error: 'Documento não encontrado' }),
              },
            ],
            isError: true,
          });
        }

        const content = `${document.title}\n\n${document.description}`;
        const suggestions = await getLLMProvider().suggestImprovements(content);

        result = {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ suggestions }, null, 2),
            },
          ],
        };
        break;
      }

      case 'check_document_compliance': {
        const documentId = typeof args?.documentId === 'string' ? args.documentId : undefined;
        if (!documentId) {
          return res.status(400).json({
            content: [
              {
                type: 'text',
                text: JSON.stringify({ error: 'documentId é obrigatório' }),
              },
            ],
            isError: true,
          });
        }
        const document = db.getDocumentById(documentId);
        if (!document) {
          return res.status(404).json({
            content: [
              {
                type: 'text',
                text: JSON.stringify({ error: 'Documento não encontrado' }),
              },
            ],
            isError: true,
          });
        }

        const content = `${document.title}\n\n${document.description}`;
        const rules = Array.isArray(args?.rules) ? (args.rules as string[]) : undefined;
        const compliance = await getLLMProvider().checkCompliance(content, rules);

        result = {
          content: [
            {
              type: 'text',
              text: JSON.stringify(compliance, null, 2),
            },
          ],
        };
        break;
      }

      case 'get_pending_signatures': {
        const documents = db.getAllDocuments();
        const pendingSignatures: Array<{
          documentId: string;
          documentTitle: string;
          signature: any;
        }> = [];

        documents.forEach((doc) => {
          doc.signatures
            .filter((sig) => sig.status === 'pending')
            .forEach((sig) => {
              pendingSignatures.push({
                documentId: doc.id,
                documentTitle: doc.title,
                signature: sig,
              });
            });
        });

        result = {
          content: [
            {
              type: 'text',
              text: JSON.stringify(pendingSignatures, null, 2),
            },
          ],
        };
        break;
      }

      case 'get_user_documents': {
        const userId = typeof args?.userId === 'string' ? args.userId : undefined;
        if (!userId) {
          return res.status(400).json({
            content: [
              {
                type: 'text',
                text: JSON.stringify({ error: 'userId é obrigatório' }),
              },
            ],
            isError: true,
          });
        }
        const documents = db.getAllDocuments();
        const userDocs = documents.filter((doc) => doc.createdBy.id === userId);

        result = {
          content: [
            {
              type: 'text',
              text: JSON.stringify(userDocs, null, 2),
            },
          ],
        };
        break;
      }

      default:
        return res.status(400).json({
          content: [
            {
              type: 'text',
              text: JSON.stringify({ error: `Ferramenta desconhecida: ${name}` }),
            },
          ],
          isError: true,
        });
    }

    res.json(result);
  } catch (error) {
    console.error('Erro ao executar ferramenta MCP:', error);
    res.status(500).json({
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: error instanceof Error ? error.message : 'Erro desconhecido',
          }),
        },
      ],
      isError: true,
    });
  }
});

// GET /api/mcp/resources - Lista recursos disponíveis
router.get('/resources', (req: Request, res: Response) => {
  res.json({
    resources: [
      {
        uri: 'documents://all',
        name: 'Todos os Documentos',
        description: 'Acesso a todos os documentos do sistema',
        mimeType: 'application/json',
      },
      {
        uri: 'documents://pending',
        name: 'Documentos Pendentes',
        description: 'Documentos aguardando assinatura',
        mimeType: 'application/json',
      },
    ],
  });
});

// GET /api/mcp/resources/:uri - Lê um recurso
router.get('/resources/:uri', (req: Request, res: Response) => {
  try {
    const { uri } = req.params;
    const decodedUri = decodeURIComponent(uri);

    if (decodedUri === 'documents://all') {
      const documents = db.getAllDocuments();
      return res.json({
        contents: [
          {
            uri: decodedUri,
            mimeType: 'application/json',
            text: JSON.stringify(documents, null, 2),
          },
        ],
      });
    }

    if (decodedUri === 'documents://pending') {
      const documents = db.getAllDocuments().filter((doc) => doc.status === 'pending');
      return res.json({
        contents: [
          {
            uri: decodedUri,
            mimeType: 'application/json',
            text: JSON.stringify(documents, null, 2),
          },
        ],
      });
    }

    res.status(404).json({ contents: [] });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler recurso' });
  }
});

export default router;

