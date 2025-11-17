# 📝 Bill Signing - Sistema de Assinatura Digital

Protótipo funcional de um sistema de assinatura digital de documentos, desenvolvido para demonstração em vídeo. O projeto utiliza dados mockados localmente, permitindo uma experiência completa sem necessidade de backend.

## 🚀 Tecnologias

- **React 19** + **TypeScript**
- **Vite** - Build tool rápida
- **Tailwind CSS** - Estilização moderna e responsiva
- **React Router** - Navegação entre páginas
- **Lucide React** - Ícones modernos
- **React Hot Toast** - Notificações elegantes

## ✨ Funcionalidades

### 📊 Dashboard
- Visão geral com estatísticas (Total, Pendentes, Assinados, Rejeitados)
- Lista dos documentos mais recentes
- Navegação rápida para outras seções

### 📄 Gestão de Documentos
- **Listagem completa** com busca e filtros por status
- **Visualização de detalhes** com informações completas
- **Criação de novos documentos** com formulário completo
- **Adição de signatários** dinamicamente
- **Exclusão de documentos** com confirmação

### ✍️ Assinatura Digital
- **Simulação de assinatura** com comentários opcionais
- **Status em tempo real** (Pendente, Assinado, Rejeitado)
- **Preview de assinaturas** com histórico
- **Indicadores visuais** de progresso (X/Y assinaturas)

### 🎨 Interface
- **Tema claro/escuro** com toggle no header
- **Animações suaves** (fade-in, scale-in, slide-up)
- **Design responsivo** (mobile + desktop)
- **Feedback visual** (toasts, loaders, estados de hover)

## 🛠️ Instalação

```bash
# Instalar dependências
yarn install

# Iniciar servidor de desenvolvimento
yarn dev

# Build para produção
yarn build

# Preview da build
yarn preview
```

## 📁 Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── DocumentCard.tsx
│   ├── Modal.tsx
│   └── Layout.tsx
├── pages/           # Páginas da aplicação
│   ├── Home.tsx
│   ├── Documents.tsx
│   ├── DocumentDetails.tsx
│   ├── CreateDocument.tsx
│   └── Settings.tsx
├── context/         # Context API para estado global
│   └── AppContext.tsx
├── hooks/           # Hooks customizados
│   └── useMockApi.ts
├── mocks/           # Dados mockados
│   └── data.ts
└── types/           # Definições TypeScript
    └── index.ts
```

## 💾 Dados Mockados

Os dados são armazenados no `localStorage` do navegador, simulando uma API real com delay de 800ms. O sistema vem pré-populado com 5 documentos de exemplo, incluindo diferentes status e assinaturas.

### Estados dos Documentos
- **Pendente**: Aguardando assinaturas
- **Assinado**: Todas as assinaturas concluídas
- **Rejeitado**: Documento rejeitado por um signatário
- **Expirado**: Data de validade expirada

## 🎯 Fluxo de Uso

1. **Criar Documento**: Acesse "Novo Documento" e preencha os dados
2. **Adicionar Signatários**: Adicione emails e nomes dos signatários
3. **Visualizar**: Veja a lista de documentos com filtros e busca
4. **Assinar**: Clique em um documento e assine diretamente na página de detalhes
5. **Acompanhar**: Monitore o progresso das assinaturas em tempo real

## 🎬 Para Gravação de Vídeo

Este protótipo foi otimizado para demonstrações:

- ✅ **Sem dependências externas**: Funciona completamente offline
- ✅ **Navegação fluida**: Transições suaves entre páginas
- ✅ **Feedbacks visuais**: Toasts, loaders e animações em todas as ações
- ✅ **Dados pré-carregados**: 5 documentos de exemplo para demonstração imediata
- ✅ **UI profissional**: Design moderno inspirado em apps SaaS

## 📝 Licença

Este é um projeto de demonstração desenvolvido para fins educacionais e de portfólio.