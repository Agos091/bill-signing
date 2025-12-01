# 🧪 Guia de Testes

Este projeto usa testes unitários com cobertura configurada para SonarCloud.

## 📊 Cobertura Esperada

- **Backend:** 75% mínimo
- **Frontend:** 25% mínimo

## 🚀 Executar Testes

### Backend

```bash
cd server
yarn test              # Executar todos os testes
yarn test:watch         # Modo watch (re-executa ao salvar)
yarn test:coverage      # Executar com relatório de cobertura
yarn test:ci            # Modo CI (sem watch, com cobertura)
```

### Frontend

```bash
yarn test              # Executar todos os testes
yarn test:watch         # Modo watch
yarn test:coverage      # Executar com relatório de cobertura
yarn test:ui            # Interface visual do Vitest
```

## 📁 Estrutura de Testes

### Backend
```
server/src/
├── services/
│   └── __tests__/
│       └── database.test.ts
└── routes/
    └── __tests__/
        ├── documents.test.ts
        ├── users.test.ts
        └── mcp.test.ts
```

### Frontend
```
src/
├── components/
│   └── __tests__/
│       └── Header.test.tsx
├── hooks/
│   └── __tests__/
│       └── useMockApi.test.ts
├── context/
│   └── __tests__/
│       └── AppContext.test.tsx
└── config/
    └── __tests__/
        └── api.test.ts
```

## 📈 Ver Relatórios de Cobertura

Após executar `yarn test:coverage`:

- **Backend:** Abra `server/coverage/index.html` no navegador
- **Frontend:** Abra `coverage/index.html` no navegador

## 🔍 SonarCloud

Os relatórios de cobertura são enviados automaticamente para o SonarCloud via GitHub Actions.

Veja [SONARCLOUD_SETUP.md](./SONARCLOUD_SETUP.md) para configuração completa.

## ✅ Checklist de Testes

### Backend
- [x] Database service
- [x] Documents routes
- [x] Users routes
- [x] MCP routes

### Frontend
- [x] Header component
- [x] useMockApi hook
- [x] AppContext
- [x] API config

## 🎯 Adicionar Novos Testes

### Exemplo Backend (Jest)

```typescript
import { describe, it, expect } from '@jest/globals';
import { minhaFuncao } from '../minhaFuncao';

describe('minhaFuncao', () => {
  it('should do something', () => {
    const result = minhaFuncao();
    expect(result).toBe(expected);
  });
});
```

### Exemplo Frontend (Vitest)

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MeuComponente } from '../MeuComponente';

describe('MeuComponente', () => {
  it('should render', () => {
    render(<MeuComponente />);
    expect(screen.getByText('Hello')).toBeDefined();
  });
});
```

## 🐛 Troubleshooting

### Testes não encontram módulos
- Verifique se os arquivos estão em `__tests__` ou terminam com `.test.ts`/`.spec.ts`
- Verifique os caminhos de import

### Cobertura não aparece
- Execute `yarn test:coverage` explicitamente
- Verifique se os arquivos não estão em `.gitignore`

### Erros de TypeScript
- Execute `yarn build` primeiro
- Verifique se `tsconfig.json` está configurado corretamente

