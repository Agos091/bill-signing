# 🚀 Guia de Deploy

Este guia explica como fazer deploy do servidor Bill Signing em diferentes plataformas de hospedagem.

## 📋 Pré-requisitos

1. Conta na plataforma escolhida
2. Repositório Git (GitHub, GitLab, etc.)
3. Variáveis de ambiente configuradas

## 🎯 Opções de Hospedagem Recomendadas

### 1. Railway (Recomendado) ⭐

**Vantagens:**
- Deploy automático via Git
- Plano gratuito generoso
- HTTPS automático
- Configuração simples

**Passos:**

1. Acesse [Railway.app](https://railway.app) e faça login
2. Clique em "New Project" → "Deploy from GitHub repo"
3. Selecione seu repositório
4. Railway detectará automaticamente o `railway.json`
5. Configure as variáveis de ambiente:
   - `PORT` (opcional, Railway define automaticamente)
   - `NODE_ENV=production`
   - `CORS_ORIGIN` (URL do seu frontend)
   - `LLM_PROVIDER` (openai ou anthropic)
   - `OPENAI_API_KEY` ou `ANTHROPIC_API_KEY`
6. Railway fará o deploy automaticamente
7. Acesse a URL fornecida (ex: `https://seu-projeto.railway.app`)

**Nota:** O arquivo `railway.json` já está configurado para buildar e iniciar o servidor corretamente.

---

### 2. Render

**Vantagens:**
- Deploy automático via Git
- Plano gratuito (com limitações)
- HTTPS automático
- Interface simples

**Passos:**

1. Acesse [Render.com](https://render.com) e faça login
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - **Name:** bill-signing-server
   - **Environment:** Node
   - **Build Command:** `cd server && yarn install && yarn build`
   - **Start Command:** `cd server && yarn start`
   - **Root Directory:** (deixe vazio, o comando já entra na pasta server)
5. Adicione as variáveis de ambiente na aba "Environment"
6. Clique em "Create Web Service"
7. Render fará o deploy automaticamente

**Nota:** O arquivo `render.yaml` já está configurado, mas você pode configurar manualmente também.

---

### 3. Fly.io

**Vantagens:**
- Boa para aplicações globais
- Plano gratuito generoso
- Deploy via CLI

**Passos:**

1. Instale o Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Faça login: `fly auth login`
3. No diretório `server/`, execute: `fly launch`
4. Siga as instruções do CLI
5. Configure as variáveis de ambiente: `fly secrets set KEY=value`
6. Deploy: `fly deploy`

---

### 4. Vercel (Frontend) + Railway/Render (Backend)

**Para o Frontend (Vercel):**

1. Acesse [Vercel.com](https://vercel.com)
2. Importe seu repositório
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** (raiz do projeto)
   - **Build Command:** `yarn build`
   - **Output Directory:** `dist`
4. Adicione variável de ambiente: `VITE_API_URL` (URL do seu backend)
5. Deploy automático

**Para o Backend:** Use Railway ou Render conforme descrito acima.

---

## 🔧 Configuração de Variáveis de Ambiente

Independente da plataforma, configure estas variáveis:

```bash
# Obrigatórias
NODE_ENV=production
LLM_PROVIDER=openai  # ou 'anthropic'
OPENAI_API_KEY=sua-chave  # se usar OpenAI
ANTHROPIC_API_KEY=sua-chave  # se usar Anthropic

# Opcionais (com valores padrão)
PORT=3001  # Geralmente definido automaticamente pela plataforma
CORS_ORIGIN=https://seu-frontend.vercel.app  # URL do seu frontend
```

---

## 🐳 Deploy com Docker

Se preferir usar Docker diretamente:

1. **Build da imagem:**
   ```bash
   cd server
   docker build -t bill-signing-server .
   ```

2. **Execute o container:**
   ```bash
   docker run -d \
     -p 3001:3001 \
     -e NODE_ENV=production \
     -e LLM_PROVIDER=openai \
     -e OPENAI_API_KEY=sua-chave \
     -e CORS_ORIGIN=https://seu-frontend.vercel.app \
     --name bill-signing-server \
     bill-signing-server
   ```

3. **Para produção, use Docker Compose ou serviços como:**
   - DigitalOcean App Platform
   - AWS ECS/Fargate
   - Google Cloud Run
   - Azure Container Instances

---

## ✅ Verificação Pós-Deploy

Após o deploy, verifique:

1. **Health Check:**
   ```bash
   curl https://seu-servidor.com/health
   ```
   Deve retornar: `{"status":"ok","timestamp":"..."}`

2. **API Endpoints:**
   ```bash
   curl https://seu-servidor.com/api/documents
   ```

3. **MCP Endpoints:**
   ```bash
   curl https://seu-servidor.com/api/mcp/tools
   ```

---

## 🔒 Segurança em Produção

⚠️ **IMPORTANTE:** Antes de colocar em produção:

1. ✅ Configure HTTPS (geralmente automático nas plataformas)
2. ✅ Adicione autenticação/autorização
3. ✅ Use banco de dados real (PostgreSQL, MongoDB, etc.)
4. ✅ Configure rate limiting
5. ✅ Adicione logging e monitoramento
6. ✅ Configure CORS corretamente
7. ✅ Use variáveis de ambiente para secrets (nunca commite no Git)
8. ✅ Configure backup do banco de dados

---

## 📝 Atualizando o Frontend

Após fazer deploy do backend, atualize a URL da API no frontend:

**Arquivo:** `src/config/api.ts`

```typescript
export const API_URL = import.meta.env.VITE_API_URL || 'https://seu-servidor.railway.app';
```

Configure a variável `VITE_API_URL` no Vercel ou na plataforma do frontend.

---

## 🆘 Troubleshooting

### Erro: "Cannot find module"
- Verifique se o build foi executado: `yarn build`
- Verifique se o `dist/` foi incluído no deploy

### Erro: "Port already in use"
- A plataforma geralmente define a porta automaticamente via `process.env.PORT`
- Não hardcode a porta 3001, use `process.env.PORT || 3001`

### Erro: CORS
- Configure `CORS_ORIGIN` com a URL exata do frontend (com https://)
- Não use `*` em produção

### Erro: API Keys não funcionam
- Verifique se as variáveis de ambiente estão configuradas corretamente
- Verifique se não há espaços extras nos valores
- Use o formato exato da chave (sem aspas)

---

## 📚 Recursos Adicionais

- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Fly.io Docs](https://fly.io/docs)
- [Vercel Docs](https://vercel.com/docs)

