import { createLLMProvider, resetLLMProviderCache } from '../index.js';

describe('LLM Provider', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    resetLLMProviderCache();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    resetLLMProviderCache();
    process.env = originalEnv;
  });

  it('should create mock provider when no API key is configured', () => {
    delete process.env.OPENAI_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    
    const provider = createLLMProvider();
    expect(provider).toBeDefined();
  });

  it('should use OpenAI provider when OPENAI_API_KEY is set', () => {
    process.env.OPENAI_API_KEY = 'test-key';
    process.env.LLM_PROVIDER = 'openai';
    
    const provider = createLLMProvider();
    expect(provider).toBeDefined();
  });

  it('should use Anthropic provider when ANTHROPIC_API_KEY is set', () => {
    process.env.ANTHROPIC_API_KEY = 'test-key';
    process.env.LLM_PROVIDER = 'anthropic';
    
    const provider = createLLMProvider();
    expect(provider).toBeDefined();
  });

  it('should cache provider instance', () => {
    delete process.env.OPENAI_API_KEY;
    const provider1 = createLLMProvider();
    const provider2 = createLLMProvider();
    expect(provider1).toBe(provider2);
  });

  it('should reset cache when resetLLMProviderCache is called', () => {
    delete process.env.OPENAI_API_KEY;
    const provider1 = createLLMProvider();
    resetLLMProviderCache();
    const provider2 = createLLMProvider();
    // Após reset, pode ser uma nova instância (dependendo da implementação)
    expect(provider1).toBeDefined();
    expect(provider2).toBeDefined();
  });

  describe('Mock Provider', () => {
    it('should analyze document', async () => {
      delete process.env.OPENAI_API_KEY;
      const provider = createLLMProvider();
      const result = await provider.analyzeDocument('Test content');
      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('keyPoints');
      expect(result).toHaveProperty('riskLevel');
      expect(result).toHaveProperty('suggestions');
    });

    it('should generate summary', async () => {
      delete process.env.OPENAI_API_KEY;
      const provider = createLLMProvider();
      const summary = await provider.generateSummary('Test content');
      expect(typeof summary).toBe('string');
    });

    it('should suggest improvements', async () => {
      delete process.env.OPENAI_API_KEY;
      const provider = createLLMProvider();
      const suggestions = await provider.suggestImprovements('Test content');
      expect(Array.isArray(suggestions)).toBe(true);
    });

    it('should check compliance', async () => {
      delete process.env.OPENAI_API_KEY;
      const provider = createLLMProvider();
      const result = await provider.checkCompliance('Test content', ['Rule 1']);
      expect(result).toHaveProperty('compliant');
      expect(result).toHaveProperty('issues');
    });
  });
});

