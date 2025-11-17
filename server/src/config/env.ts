import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  llmProvider: (process.env.LLM_PROVIDER || 'openai') as 'openai' | 'anthropic',
  openaiApiKey: process.env.OPENAI_API_KEY,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  nodeEnv: process.env.NODE_ENV || 'development',
};

// Validação de configuração
if (config.llmProvider === 'openai' && !config.openaiApiKey) {
  console.warn('⚠️  OPENAI_API_KEY não configurada');
}

if (config.llmProvider === 'anthropic' && !config.anthropicApiKey) {
  console.warn('⚠️  ANTHROPIC_API_KEY não configurada');
}

