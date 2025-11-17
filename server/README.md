# Bill Signing - Backend Server

Backend do sistema de assinatura de documentos com integração MCP (Model Context Protocol) e LLM.

## 🚀 Funcionalidades

- **REST API** completa para gerenciamento de documentos
- **MCP Server** para integração com LLMs
- **Análise inteligente** de documentos usando LLM
- **Geração de resumos** automáticos
- **Sugestões de melhorias** baseadas em IA
- **Verificação de conformidade** legal

## 📦 Instalação

```bash
cd server
yarn install
```

## ⚙️ Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Configure as variáveis de ambiente:
- `LLM_PROVIDER`: Escolha entre `openai` ou `anthropic`
- `OPENAI_API_KEY`: Sua chave da API OpenAI (se usar OpenAI)
- `ANTHROPIC_API_KEY`: Sua chave da API Anthropic (se usar Anthropic)
- `PORT`: Porta do servidor (padrão: 3001)
- `CORS_ORIGIN`: Origem permitida para CORS (padrão: http://localhost:5173)

## 🏃 Execução

### Servidor REST API

```bash
yarn dev
```

O servidor estará disponível em `http://localhost:3001`

### Servidor MCP

```bash
yarn mcp
```

O servidor MCP roda via stdio e pode ser conectado a clientes MCP.

## 📡 Endpoints da API

### Documentos

- `GET /api/documents` - Lista todos os documentos
- `GET /api/documents/:id` - Obtém um documento específico
- `POST /api/documents` - Cria um novo documento
- `PUT /api/documents/:id` - Atualiza um documento
- `DELETE /api/documents/:id` - Deleta um documento
- `POST /api/documents/:id/sign` - Assina um documento
- `POST /api/documents/:id/analyze` - Analisa documento com LLM
- `POST /api/documents/:id/summary` - Gera resumo do documento
- `POST /api/documents/:id/suggestions` - Gera sugestões de melhorias
- `POST /api/documents/:id/compliance` - Verifica conformidade

### Usuários

- `GET /api/users` - Lista todos os usuários
- `GET /api/users/current` - Obtém usuário atual
- `GET /api/users/:id` - Obtém um usuário específico

## 🔧 Ferramentas MCP

O servidor MCP expõe as seguintes ferramentas:

- `get_documents` - Lista todos os documentos
- `get_document` - Obtém detalhes de um documento
- `analyze_document` - Analisa documento com LLM
- `generate_document_summary` - Gera resumo inteligente
- `suggest_document_improvements` - Sugere melhorias
- `check_document_compliance` - Verifica conformidade
- `get_pending_signatures` - Lista assinaturas pendentes
- `get_user_documents` - Lista documentos de um usuário

## 🏗️ Estrutura

```
server/
├── src/
│   ├── index.ts              # Servidor Express principal
│   ├── mcp-server.ts         # Servidor MCP
│   ├── routes/               # Rotas da API
│   │   ├── documents.ts
│   │   └── users.ts
│   ├── services/             # Serviços
│   │   ├── database.ts       # Simulação de banco de dados
│   │   └── llm/              # Provedores LLM
│   │       ├── index.ts
│   │       ├── openaiProvider.ts
│   │       └── anthropicProvider.ts
│   ├── types/                # Tipos TypeScript
│   └── data/                 # Dados mock
└── package.json
```

## 🔐 Segurança

⚠️ **Nota**: Este é um servidor de desenvolvimento. Para produção:

- Implemente autenticação/autorização
- Use banco de dados real (PostgreSQL, MongoDB, etc.)
- Adicione validação de entrada mais robusta
- Configure HTTPS
- Implemente rate limiting
- Adicione logging e monitoramento

