import { describe, it, expect } from 'vitest';
import { API_BASE_URL, apiClient } from '../api';

describe('API Config', () => {
  it('should have API_BASE_URL defined', () => {
    expect(API_BASE_URL).toBeDefined();
    expect(typeof API_BASE_URL).toBe('string');
  });

  it('should have apiClient with all methods', () => {
    expect(apiClient).toBeDefined();
    expect(typeof apiClient.get).toBe('function');
    expect(typeof apiClient.post).toBe('function');
    expect(typeof apiClient.put).toBe('function');
    expect(typeof apiClient.delete).toBe('function');
  });
});

