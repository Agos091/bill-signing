import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRouter from './routes/auth.js';
import documentsRouter from './routes/documents.js';
import usersRouter from './routes/users.js';
import uploadRouter from './routes/upload.js';
import mcpRouter from './routes/mcp.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const allowedOrigins = CORS_ORIGIN.split(',')
  .map((origin) => origin.trim().replace(/^['"]|['"]$/g, ''))
  .filter(Boolean);

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`CORS bloqueado para origem não permitida: ${origin}`);
      return callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
  })
);

// JSON parser
app.use(express.json({ 
  strict: false,
  limit: '10mb'
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos da pasta uploads
const uploadsDir = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Health check (público)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRouter);      // Rotas de autenticação (públicas)
app.use('/api/documents', documentsRouter);  // Rotas de documentos (protegidas)
app.use('/api/users', usersRouter);          // Rotas de usuários (protegidas)
app.use('/api/upload', uploadRouter);        // Rotas de upload
app.use('/api/mcp', mcpRouter);              // Rotas MCP

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError || (err && err.type === 'entity.parse.failed')) {
    console.error('Erro ao fazer parse do JSON:', err.message);
    return res.status(400).json({ error: 'JSON inválido no body da requisição' });
  }
  
  console.error('Erro:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📋 API disponível em http://localhost:${PORT}/api`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});
