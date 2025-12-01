import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMockApi } from '../useMockApi';

describe('useMockApi', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return api methods', () => {
    const { result } = renderHook(() => useMockApi());
    expect(result.current).toBeDefined();
    expect(result.current.fetchDocuments).toBeDefined();
    expect(result.current.createDocument).toBeDefined();
    expect(result.current.updateDocument).toBeDefined();
    expect(result.current.deleteDocument).toBeDefined();
    expect(result.current.signDocument).toBeDefined();
    expect(typeof result.current.isLoading).toBe('boolean');
  });

  it('should fetch documents', async () => {
    const { result } = renderHook(() => useMockApi());
    const documents = await result.current.fetchDocuments();
    expect(Array.isArray(documents)).toBe(true);
  });

  it('should create document', async () => {
    const { result } = renderHook(() => useMockApi());
    const newDoc = {
      title: 'Test Document',
      description: 'Test Description',
      signatures: [{ userName: 'John', userEmail: 'john@test.com' }],
    };
    const doc = await result.current.createDocument(newDoc);
    expect(doc).toBeDefined();
    expect(doc.title).toBe('Test Document');
  });
});

