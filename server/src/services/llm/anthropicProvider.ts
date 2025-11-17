import Anthropic from '@anthropic-ai/sdk';
import type { LLMProvider, LLMAnalysisResult } from '../../types/index.js';

export class AnthropicProvider implements LLMProvider {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async analyzeDocument(content: string): Promise<LLMAnalysisResult> {
    const prompt = `Analise o seguinte documento e forneça uma análise estruturada em JSON:
    
Documento:
${content}

Forneça uma resposta JSON com a seguinte estrutura:
{
  "summary": "resumo do documento em 2-3 frases",
  "keyPoints": ["ponto 1", "ponto 2", "ponto 3"],
  "riskLevel": "low|medium|high",
  "suggestions": ["sugestão 1", "sugestão 2"],
  "estimatedReadingTime": número em minutos
}`;

    try {
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        system: 'Você é um assistente especializado em análise de documentos legais e contratos. Sempre responda em JSON válido.',
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Resposta inválida do Anthropic');
      }

      const result = JSON.parse(content.text);
      return {
        summary: result.summary || '',
        keyPoints: result.keyPoints || [],
        riskLevel: result.riskLevel || 'medium',
        suggestions: result.suggestions || [],
        estimatedReadingTime: result.estimatedReadingTime,
      };
    } catch (error) {
      console.error('Erro ao analisar documento com Anthropic:', error);
      throw new Error('Falha ao analisar documento');
    }
  }

  async generateSummary(content: string): Promise<string> {
    const prompt = `Gere um resumo conciso e profissional do seguinte documento:
    
${content}

Resumo:`;

    try {
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        system: 'Você é um assistente especializado em resumir documentos legais e contratos de forma clara e objetiva.',
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Resposta inválida do Anthropic');
      }

      return content.text || 'Não foi possível gerar o resumo.';
    } catch (error) {
      console.error('Erro ao gerar resumo com Anthropic:', error);
      throw new Error('Falha ao gerar resumo');
    }
  }

  async suggestImprovements(content: string): Promise<string[]> {
    const prompt = `Analise o seguinte documento e sugira melhorias específicas e acionáveis:
    
${content}

Forneça uma lista JSON com sugestões:
{
  "suggestions": ["sugestão 1", "sugestão 2", "sugestão 3"]
}`;

    try {
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        system: 'Você é um especialista em revisão de documentos legais. Forneça sugestões práticas e específicas. Sempre responda em JSON válido.',
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Resposta inválida do Anthropic');
      }

      const result = JSON.parse(content.text);
      return result.suggestions || [];
    } catch (error) {
      console.error('Erro ao sugerir melhorias com Anthropic:', error);
      throw new Error('Falha ao gerar sugestões');
    }
  }

  async checkCompliance(
    content: string,
    rules?: string[]
  ): Promise<{ compliant: boolean; issues: string[] }> {
    const rulesText = rules?.length
      ? `\n\nRegras de conformidade a verificar:\n${rules.join('\n')}`
      : '';

    const prompt = `Verifique se o seguinte documento está em conformidade com as regras especificadas:
    
${content}${rulesText}

Forneça uma resposta JSON:
{
  "compliant": true|false,
  "issues": ["problema 1", "problema 2"]
}`;

    try {
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        system: 'Você é um especialista em conformidade legal. Seja preciso e objetivo. Sempre responda em JSON válido.',
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Resposta inválida do Anthropic');
      }

      const result = JSON.parse(content.text);
      return {
        compliant: result.compliant ?? true,
        issues: result.issues || [],
      };
    } catch (error) {
      console.error('Erro ao verificar conformidade com Anthropic:', error);
      throw new Error('Falha ao verificar conformidade');
    }
  }
}

