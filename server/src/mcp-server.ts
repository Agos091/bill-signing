#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  type CallToolRequest,
  type ReadResourceRequest,
} from '@modelcontextprotocol/sdk/types.js';
import { db } from './services/database.js';
import { createLLMProvider } from './services/llm/index.js';
import type { Document } from './types/index.js';

// Lazy initialization do LLM provider para evitar erros na inicialização
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

class BillSigningMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'bill-signing-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
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
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_documents': {
            let documents = db.getAllDocuments();
            if (args?.status) {
              documents = documents.filter((doc) => doc.status === args.status);
            }
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(documents, null, 2),
                },
              ],
            };
          }

          case 'get_document': {
            const documentId = typeof args?.documentId === 'string' ? args.documentId : undefined;
            if (!documentId) {
              return {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify({ error: 'documentId é obrigatório' }),
                  },
                ],
                isError: true,
              };
            }
            const document = db.getDocumentById(documentId);
            if (!document) {
              return {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify({ error: 'Documento não encontrado' }),
                  },
                ],
                isError: true,
              };
            }
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(document, null, 2),
                },
              ],
            };
          }

          case 'analyze_document': {
            const documentId = typeof args?.documentId === 'string' ? args.documentId : undefined;
            if (!documentId) {
              return {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify({ error: 'documentId é obrigatório' }),
                  },
                ],
                isError: true,
              };
            }
            const document = db.getDocumentById(documentId);
            if (!document) {
              return {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify({ error: 'Documento não encontrado' }),
                  },
                ],
                isError: true,
              };
            }

            const content = `${document.title}\n\n${document.description}`;
            const analysis = await getLLMProvider().analyzeDocument(content);

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(analysis, null, 2),
                },
              ],
            };
          }

          case 'generate_document_summary': {
            const documentId = typeof args?.documentId === 'string' ? args.documentId : undefined;
            if (!documentId) {
              return {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify({ error: 'documentId é obrigatório' }),
                  },
                ],
                isError: true,
              };
            }
            const document = db.getDocumentById(documentId);
            if (!document) {
              return {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify({ error: 'Documento não encontrado' }),
                  },
                ],
                isError: true,
              };
            }

            const content = `${document.title}\n\n${document.description}`;
            const summary = await getLLMProvider().generateSummary(content);

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({ summary }, null, 2),
                },
              ],
            };
          }

          case 'suggest_document_improvements': {
            const documentId = typeof args?.documentId === 'string' ? args.documentId : undefined;
            if (!documentId) {
              return {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify({ error: 'documentId é obrigatório' }),
                  },
                ],
                isError: true,
              };
            }
            const document = db.getDocumentById(documentId);
            if (!document) {
              return {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify({ error: 'Documento não encontrado' }),
                  },
                ],
                isError: true,
              };
            }

            const content = `${document.title}\n\n${document.description}`;
            const suggestions = await getLLMProvider().suggestImprovements(content);

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({ suggestions }, null, 2),
                },
              ],
            };
          }

          case 'check_document_compliance': {
            const documentId = typeof args?.documentId === 'string' ? args.documentId : undefined;
            if (!documentId) {
              return {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify({ error: 'documentId é obrigatório' }),
                  },
                ],
                isError: true,
              };
            }
            const document = db.getDocumentById(documentId);
            if (!document) {
              return {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify({ error: 'Documento não encontrado' }),
                  },
                ],
                isError: true,
              };
            }

            const content = `${document.title}\n\n${document.description}`;
            const rules = Array.isArray(args?.rules) ? args.rules as string[] : undefined;
            const compliance = await getLLMProvider().checkCompliance(
              content,
              rules
            );

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(compliance, null, 2),
                },
              ],
            };
          }

          case 'get_pending_signatures': {
            const documents = db.getAllDocuments();
            const pendingSignatures: Array<{
              documentId: string;
              documentTitle: string;
              signature: Document['signatures'][0];
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

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(pendingSignatures, null, 2),
                },
              ],
            };
          }

          case 'get_user_documents': {
            const userId = typeof args?.userId === 'string' ? args.userId : undefined;
            if (!userId) {
              return {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify({ error: 'userId é obrigatório' }),
                  },
                ],
                isError: true,
              };
            }
            const documents = db.getAllDocuments();
            const userDocs = documents.filter(
              (doc) => doc.createdBy.id === userId
            );

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(userDocs, null, 2),
                },
              ],
            };
          }

          default:
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({ error: `Ferramenta desconhecida: ${name}` }),
                },
              ],
              isError: true,
            };
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: error instanceof Error ? error.message : 'Erro desconhecido',
              }),
            },
          ],
          isError: true,
        };
      }
    });

    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
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
    }));

    // Handle resource reads
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request: ReadResourceRequest) => {
      const { uri } = request.params;

      if (uri === 'documents://all') {
        const documents = db.getAllDocuments();
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(documents, null, 2),
            },
          ],
        };
      }

      if (uri === 'documents://pending') {
        const documents = db.getAllDocuments().filter((doc) => doc.status === 'pending');
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(documents, null, 2),
            },
          ],
        };
      }

      return {
        contents: [],
      };
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Bill Signing MCP Server rodando via stdio');
  }
}

// Inicializa o servidor se executado diretamente
if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('mcp-server')) {
  const server = new BillSigningMCPServer();
  server.run().catch(console.error);
}

export { BillSigningMCPServer };

