import type { LLMProvider } from '../../types/index.js';
import { OpenAIProvider } from './openaiProvider.js';
import { AnthropicProvider } from './anthropicProvider.js';

let cachedProvider: LLMProvider | null = null;

export function createLLMProvider(): LLMProvider {
  // Cache do provider para evitar múltiplas instâncias
  if (cachedProvider) {
    return cachedProvider;
  }

  const provider = process.env.LLM_PROVIDER || 'openai';

  if (provider === 'anthropic') {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.warn('⚠️  ANTHROPIC_API_KEY não configurada, usando mock provider');
      cachedProvider = createMockProvider();
      return cachedProvider;
    }
    cachedProvider = new AnthropicProvider(apiKey);
    return cachedProvider;
  }

  // Default: OpenAI
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('⚠️  OPENAI_API_KEY não configurada, usando mock provider');
    cachedProvider = createMockProvider();
    return cachedProvider;
  }
  cachedProvider = new OpenAIProvider(apiKey);
  return cachedProvider;
}

// Mock provider para desenvolvimento sem API key
function createMockProvider(): LLMProvider {
  return {
    async analyzeDocument(content: string) {
      return {
        summary: 'Análise mock - configure uma API key para análise real',
        keyPoints: ['Ponto 1', 'Ponto 2'],
        riskLevel: 'medium',
        suggestions: ['Configure OPENAI_API_KEY ou ANTHROPIC_API_KEY'],
        estimatedReadingTime: 5,
      };
    },
    async generateSummary(content: string) {
      return 'Resumo mock - configure uma API key para resumo real';
    },
    async suggestImprovements(content: string) {
      return ['Configure OPENAI_API_KEY ou ANTHROPIC_API_KEY para sugestões reais'];
    },
    async checkCompliance(content: string, rules?: string[]) {
      return {
        compliant: true,
        issues: ['Configure uma API key para verificação real'],
      };
    },
  };
}

export { OpenAIProvider, AnthropicProvider };

