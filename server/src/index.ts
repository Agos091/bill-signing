import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import documentsRouter from './routes/documents.js';
import usersRouter from './routes/users.js';
import uploadRouter from './routes/upload.js';
import mcpRouter from './routes/mcp.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Middleware
app.use(cors({ origin: CORS_ORIGIN }));

// JSON parser - permite body vazio
app.use(express.json({ 
  strict: false,
  limit: '10mb'
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos da pasta uploads
const uploadsDir = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/documents', documentsRouter);
app.use('/api/users', usersRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/mcp', mcpRouter);

// Error handling middleware (deve vir DEPOIS das rotas)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Erro de parsing JSON
  if (err instanceof SyntaxError || (err && err.type === 'entity.parse.failed')) {
    console.error('Erro ao fazer parse do JSON:', err.message);
    return res.status(400).json({ error: 'JSON inválido no body da requisição' });
  }
  
  // Outros erros
  console.error('Erro:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📋 API disponível em http://localhost:${PORT}/api`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});

