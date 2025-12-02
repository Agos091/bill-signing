import { config } from '../env.js';

describe('Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should have default port', () => {
    delete process.env.PORT;
    const { config: testConfig } = require('../env.js');
    expect(testConfig.port).toBe(3001);
  });

  it('should use PORT from environment', () => {
    process.env.PORT = '4000';
    const { config: testConfig } = require('../env.js');
    expect(testConfig.port).toBe(4000);
  });

  it('should have default CORS origin', () => {
    delete process.env.CORS_ORIGIN;
    const { config: testConfig } = require('../env.js');
    // O padrão pode variar, então apenas verificamos que existe
    expect(testConfig.corsOrigin).toBeDefined();
  });

  it('should use CORS_ORIGIN from environment', () => {
    process.env.CORS_ORIGIN = 'http://localhost:3000';
    const { config: testConfig } = require('../env.js');
    expect(testConfig.corsOrigin).toBe('http://localhost:3000');
  });

  it('should have default LLM provider', () => {
    delete process.env.LLM_PROVIDER;
    const { config: testConfig } = require('../env.js');
    expect(testConfig.llmProvider).toBe('openai');
  });

  it('should use LLM_PROVIDER from environment', () => {
    process.env.LLM_PROVIDER = 'anthropic';
    const { config: testConfig } = require('../env.js');
    expect(testConfig.llmProvider).toBe('anthropic');
  });

  it('should have default NODE_ENV', () => {
    delete process.env.NODE_ENV;
    const { config: testConfig } = require('../env.js');
    expect(testConfig.nodeEnv).toBe('development');
  });

  it('should use NODE_ENV from environment', () => {
    process.env.NODE_ENV = 'production';
    const { config: testConfig } = require('../env.js');
    expect(testConfig.nodeEnv).toBe('production');
  });

  it('should read OPENAI_API_KEY from environment', () => {
    process.env.OPENAI_API_KEY = 'test-key-123';
    const { config: testConfig } = require('../env.js');
    expect(testConfig.openaiApiKey).toBe('test-key-123');
  });

  it('should read ANTHROPIC_API_KEY from environment', () => {
    process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';
    const { config: testConfig } = require('../env.js');
    expect(testConfig.anthropicApiKey).toBe('test-anthropic-key');
  });
});

