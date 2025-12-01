# 🔍 Configuração do SonarCloud

Este guia explica como configurar o SonarCloud para análise de código e cobertura de testes.

## 📋 Pré-requisitos

1. Conta no [SonarCloud](https://sonarcloud.io)
2. Repositório no GitHub
3. Token do SonarCloud

## 🚀 Configuração Inicial

### 1. Criar Projeto no SonarCloud

1. Acesse [SonarCloud](https://sonarcloud.io)
2. Faça login com sua conta GitHub
3. Clique em "Create Project"
4. Selecione sua organização
5. Selecione o repositório `bill-signing`
6. Anote o **Project Key** (ex: `seu-org_bill-signing`)

### 2. Obter Token do SonarCloud

1. No SonarCloud, vá em **My Account** → **Security**
2. Gere um novo token
3. Copie o token (você só verá uma vez!)

### 3. Configurar Secrets no GitHub

1. No seu repositório GitHub, vá em **Settings** → **Secrets and variables** → **Actions**
2. Adicione um novo secret:
   - **Name:** `SONAR_TOKEN`
   - **Value:** O token que você copiou do SonarCloud

### 4. Atualizar sonar-project.properties

Atualize o arquivo `sonar-project.properties` com seu Project Key:

```properties
sonar.projectKey=seu-org_bill-signing
sonar.organization=seu-org
```

## 📊 Cobertura de Testes

O projeto está configurado com os seguintes thresholds:

### Backend (75% mínimo)
- **Branches:** 75%
- **Functions:** 75%
- **Lines:** 75%
- **Statements:** 75%

### Frontend (25% mínimo)
- **Branches:** 25%
- **Functions:** 25%
- **Lines:** 25%
- **Statements:** 25%

## 🧪 Executar Testes Localmente

### Backend

```bash
cd server
yarn test              # Executar testes
yarn test:watch         # Modo watch
yarn test:coverage      # Com cobertura
```

### Frontend

```bash
yarn test              # Executar testes
yarn test:watch         # Modo watch
yarn test:coverage      # Com cobertura
yarn test:ui            # Interface visual
```

## 🔄 CI/CD

O GitHub Actions está configurado para:

1. **Executar testes** do backend e frontend
2. **Gerar relatórios de cobertura**
3. **Enviar para SonarCloud** automaticamente

O workflow roda em:
- Push para `main` ou `develop`
- Pull Requests para `main` ou `develop`

## 📈 Verificar Cobertura

Após executar `yarn test:coverage`:

- **Backend:** `server/coverage/index.html`
- **Frontend:** `coverage/index.html`

Abra os arquivos HTML no navegador para ver o relatório visual.

## ⚙️ Configuração Atual

### Backend (Jest)
- Configuração: `server/jest.config.js`
- Threshold: 75% em todas as métricas

### Frontend (Vitest)
- Configuração: `vite.config.ts`
- Threshold: 25% em todas as métricas

### SonarCloud
- Configuração: `sonar-project.properties`
- Relatórios: `coverage/lcov.info` e `server/coverage/lcov.info`

## 🐛 Troubleshooting

### Erro: "SONAR_TOKEN not found"
- Verifique se o secret `SONAR_TOKEN` está configurado no GitHub
- Certifique-se de que o nome está exatamente como `SONAR_TOKEN`

### Erro: "Project key not found"
- Verifique o `sonar-project.properties`
- Certifique-se de que o projeto existe no SonarCloud

### Cobertura não aparece no SonarCloud
- Verifique se os arquivos `lcov.info` estão sendo gerados
- Verifique os caminhos no `sonar-project.properties`

### Testes falhando
- Execute `yarn install` novamente
- Verifique se todas as dependências estão instaladas
- Execute os testes localmente primeiro

## 📚 Recursos

- [Documentação SonarCloud](https://docs.sonarcloud.io)
- [Jest Documentation](https://jestjs.io)
- [Vitest Documentation](https://vitest.dev)

