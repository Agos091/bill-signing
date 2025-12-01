import { describe, it, expect, beforeEach } from 'vitest';
import { useMockApi } from '../useMockApi';

describe('useMockApi', () => {
  it('should return api methods', () => {
    const api = useMockApi();
    expect(api).toBeDefined();
    expect(api.fetchDocuments).toBeDefined();
    expect(api.createDocument).toBeDefined();
    expect(api.updateDocument).toBeDefined();
    expect(api.deleteDocument).toBeDefined();
    expect(api.signDocument).toBeDefined();
    expect(typeof api.isLoading).toBe('boolean');
  });

  it('should fetch documents', async () => {
    const api = useMockApi();
    const documents = await api.fetchDocuments();
    expect(Array.isArray(documents)).toBe(true);
  });

  it('should create document', async () => {
    const api = useMockApi();
    const newDoc = {
      title: 'Test Document',
      description: 'Test Description',
      signatures: [{ userName: 'John', userEmail: 'john@test.com' }],
    };
    const doc = await api.createDocument(newDoc);
    expect(doc).toBeDefined();
    expect(doc.title).toBe('Test Document');
  });
});

