# Configuração do Servidor MCP

O servidor MCP (Model Context Protocol) permite que LLMs interajam com o sistema de assinatura de documentos através de ferramentas estruturadas.

## 🚀 Executando o Servidor MCP

```bash
yarn mcp
```

O servidor MCP roda via stdio e pode ser conectado a clientes MCP compatíveis.

## 🔧 Configuração com Claude Desktop

Para usar com Claude Desktop, adicione ao arquivo de configuração do Claude:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "bill-signing": {
      "command": "node",
      "args": [
        "/caminho/absoluto/para/bill-signing/server/dist/mcp-server.js"
      ],
      "env": {
        "OPENAI_API_KEY": "sua-chave-aqui",
        "ANTHROPIC_API_KEY": "sua-chave-aqui",
        "LLM_PROVIDER": "openai"
      }
    }
  }
}
```

**Nota**: Certifique-se de compilar o TypeScript primeiro:
```bash
yarn build
```

## 🛠️ Ferramentas Disponíveis

### `get_documents`
Lista todos os documentos do sistema.

**Parâmetros opcionais:**
- `status`: Filtrar por status ('pending', 'signed', 'rejected', 'expired')

### `get_document`
Obtém detalhes de um documento específico.

**Parâmetros obrigatórios:**
- `documentId`: ID do documento

### `analyze_document`
Analisa um documento usando LLM para extrair insights, pontos-chave e sugestões.

**Parâmetros obrigatórios:**
- `documentId`: ID do documento a ser analisado

**Retorna:**
- `summary`: Resumo do documento
- `keyPoints`: Lista de pontos-chave
- `riskLevel`: Nível de risco ('low', 'medium', 'high')
- `suggestions`: Lista de sugestões
- `estimatedReadingTime`: Tempo estimado de leitura em minutos

### `generate_document_summary`
Gera um resumo inteligente de um documento usando LLM.

**Parâmetros obrigatórios:**
- `documentId`: ID do documento

### `suggest_document_improvements`
Sugere melhorias para um documento usando análise de LLM.

**Parâmetros obrigatórios:**
- `documentId`: ID do documento

### `check_document_compliance`
Verifica conformidade de um documento com regras específicas usando LLM.

**Parâmetros obrigatórios:**
- `documentId`: ID do documento

**Parâmetros opcionais:**
- `rules`: Array de strings com regras de conformidade a verificar

### `get_pending_signatures`
Lista todas as assinaturas pendentes no sistema.

### `get_user_documents`
Lista documentos criados por um usuário específico.

**Parâmetros obrigatórios:**
- `userId`: ID do usuário

## 📚 Recursos Disponíveis

### `documents://all`
Acesso a todos os documentos do sistema em formato JSON.

### `documents://pending`
Acesso a documentos aguardando assinatura em formato JSON.

## 💡 Exemplo de Uso

Com Claude Desktop configurado, você pode pedir:

- "Liste todos os documentos pendentes"
- "Analise o documento com ID '1'"
- "Gere um resumo do documento '2'"
- "Verifique a conformidade do documento '3' com as regras de GDPR"
- "Quais são as assinaturas pendentes?"

O Claude usará automaticamente as ferramentas MCP para interagir com o sistema.

