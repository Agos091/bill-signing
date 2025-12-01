export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        module: 'ESNext',
        moduleResolution: 'node',
      },
    }],
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$))',
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/data/**',
    '!src/index.ts',
    '!src/mcp-server.ts',
    '!src/routes/mcp.ts', // Temporariamente excluído devido a erro TypeScript
    '!src/services/llm/openaiProvider.ts', // Temporariamente excluído devido a erro TypeScript
    '!src/services/llm/anthropicProvider.ts', // Temporariamente excluído devido a erro TypeScript
    '!src/services/llm/index.ts', // Temporariamente excluído devido a erro TypeScript
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'json', 'html', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 15,
      functions: 40,
      lines: 30,
      statements: 30,
    },
  },
};

