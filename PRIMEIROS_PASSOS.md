# Guia de Primeiros Passos

Bem-vindo ao **Bill Signing**! Este passo a passo mostra como colocar todo o ambiente para rodar e como usar o produto pela primeira vez.

---

## 1. Requisitos

- Node.js 20+
- Yarn ou npm
- Conta no [Supabase](https://supabase.com/)
- Conta no [OpenAI ou Anthropic](https://platform.openai.com/)

---

## 2. Clonar o projeto

```bash
git clone https://github.com/Agos091/bill-signing.git
cd bill-signing
```

---

## 3. Configurar o Backend

1. Copie o arquivo `.env.example` para `.env` dentro de `server/`.
2. Preencha:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY` (ou `ANTHROPIC_API_KEY`)
3. Importe o schema no Supabase:
   - Dashboard → SQL Editor → cole `server/supabase-schema.sql` → Run.
4. Rode o backend:

```bash
cd server
npm install
npm run dev
```

---

## 4. Configurar o Frontend

1. Crie o arquivo `.env` na raiz (mesmos valores do backend, mas use apenas o `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_BASE_URL`).
2. Rode o frontend:

```bash
cd ..
npm install
npm run dev
```

O frontend sobe em `http://localhost:5173` e o backend em `http://localhost:3001`.

---

## 5. Cadastro e Login

1. Acesse `http://localhost:5173/signup`.
2. Crie um usuário.
3. Faça login.

> A conta é salva no Supabase Auth. Se a confirmação de e-mail estiver habilitada, confirme o e-mail antes de entrar.

---

## 6. Criar o primeiro documento

1. Clique em **Criar Documento**.
2. Preencha título, descrição, signatários e faça upload (opcional).
3. Salve.

Cada usuário vê apenas os documentos que criou. Para assinar, o signatário precisa acessar o link recebido por e-mail (ou acessar a página com seu login).

---

## 7. Funcionalidades de IA

- **Analisar**: gera insights sobre o documento.
- **Resumo**: cria um resumo rápido.
- **Melhorias**: sugere ajustes no texto.
- **Compliance**: verifica regras customizadas.

Essas ações só funcionam para o dono do documento e usam o provedor configurado (`OPENAI` ou `ANTHROPIC`).

---

## 8. Deploy

- **Backend**: Railway (já configurado com `nixpacks`).
- **Frontend**: Vercel. Ajuste `VITE_API_BASE_URL` e `VITE_SUPABASE_*`.
- Execute o SQL do Supabase em produção também.

---

## 9. Problemas comuns

| Erro | Solução |
|------|---------|
| `SUPABASE_URL não configurada` | Verifique as variáveis do Railway. |
| `Maximum update depth exceeded` | Certifique-se de que o backend esteja rodando e retornando dados corretos. |
| Vercel falha no build | Rode `npm run build` localmente para verificar. |
| Documentos duplicados | Certifique-se de que cada usuário esteja logado na sua própria conta. |

---

## 10. Ajuda

Se precisar de suporte:
- Abra um issue no GitHub.
- Entre em contato com o time: `contato@bill-signing.com`.

Bom uso! ✍️


