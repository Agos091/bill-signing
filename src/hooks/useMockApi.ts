import { useState, useCallback } from 'react';
import type { Document, CreateDocumentData } from '../types';

const API_DELAY = 800; // Simula latência de rede

export function useMockApi() {
  const [isLoading, setIsLoading] = useState(false);

  const simulateDelay = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(resolve, API_DELAY);
    });
  }, []);

  const fetchDocuments = useCallback(async (): Promise<Document[]> => {
    setIsLoading(true);
    await simulateDelay();
    setIsLoading(false);
    
    const stored = localStorage.getItem('documents');
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  }, [simulateDelay]);

  const createDocument = useCallback(async (data: CreateDocumentData): Promise<Document> => {
    setIsLoading(true);
    await simulateDelay();

    const stored = localStorage.getItem('documents');
    const documents: Document[] = stored ? JSON.parse(stored) : [];

    const newDocument: Document = {
      id: Date.now().toString(),
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: JSON.parse(localStorage.getItem('currentUser') || '{}'),
      signatures: data.signatures.map((sig, idx) => ({
        id: `sig-${Date.now()}-${idx}`,
        userId: '',
        userName: sig.userName,
        userEmail: sig.userEmail,
        status: 'pending' as const,
      })),
    };

    documents.unshift(newDocument);
    localStorage.setItem('documents', JSON.stringify(documents));
    
    setIsLoading(false);
    return newDocument;
  }, [simulateDelay]);

  const updateDocument = useCallback(async (id: string, updates: Partial<Document>): Promise<Document> => {
    setIsLoading(true);
    await simulateDelay();

    const stored = localStorage.getItem('documents');
    const documents: Document[] = stored ? JSON.parse(stored) : [];
    
    const index = documents.findIndex((doc) => doc.id === id);
    if (index === -1) {
      throw new Error('Documento não encontrado');
    }

    documents[index] = {
      ...documents[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem('documents', JSON.stringify(documents));
    setIsLoading(false);
    
    return documents[index];
  }, [simulateDelay]);

  const deleteDocument = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    await simulateDelay();

    const stored = localStorage.getItem('documents');
    const documents: Document[] = stored ? JSON.parse(stored) : [];
    
    const filtered = documents.filter((doc) => doc.id !== id);
    localStorage.setItem('documents', JSON.stringify(filtered));
    
    setIsLoading(false);
  }, [simulateDelay]);

  const signDocument = useCallback(async (
    documentId: string,
    signatureId: string,
    comment?: string
  ): Promise<Document> => {
    setIsLoading(true);
    await simulateDelay();

    const stored = localStorage.getItem('documents');
    const documents: Document[] = stored ? JSON.parse(stored) : [];
    
    const docIndex = documents.findIndex((doc) => doc.id === documentId);
    if (docIndex === -1) {
      throw new Error('Documento não encontrado');
    }

    const signatureIndex = documents[docIndex].signatures.findIndex(
      (sig) => sig.id === signatureId
    );
    if (signatureIndex === -1) {
      throw new Error('Assinatura não encontrada');
    }

    documents[docIndex].signatures[signatureIndex] = {
      ...documents[docIndex].signatures[signatureIndex],
      status: 'signed',
      signedAt: new Date().toISOString(),
      comment,
    };

    // Verifica se todas as assinaturas foram concluídas
    const allSigned = documents[docIndex].signatures.every(
      (sig) => sig.status === 'signed'
    );
    if (allSigned) {
      documents[docIndex].status = 'signed';
    }

    documents[docIndex].updatedAt = new Date().toISOString();
    localStorage.setItem('documents', JSON.stringify(documents));
    
    setIsLoading(false);
    return documents[docIndex];
  }, [simulateDelay]);

  return {
    isLoading,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    signDocument,
  };
}
