import { useState, useCallback } from 'react';
import { apiClient } from '../config/api';
import type { Document, User, CreateDocumentData } from '../types';

export function useApi() {
  const [isLoading, setIsLoading] = useState(false);

  const fetchDocuments = useCallback(async (): Promise<Document[]> => {
    setIsLoading(true);
    try {
      const documents = await apiClient.get<Document[]>('/documents');
      return documents;
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDocumentById = useCallback(async (id: string): Promise<Document> => {
    setIsLoading(true);
    try {
      const document = await apiClient.get<Document>(`/documents/${id}`);
      return document;
    } catch (error) {
      console.error('Erro ao buscar documento:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createDocument = useCallback(async (data: CreateDocumentData): Promise<Document> => {
    setIsLoading(true);
    try {
      const document = await apiClient.post<Document>('/documents', data);
      return document;
    } catch (error) {
      console.error('Erro ao criar documento:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateDocument = useCallback(async (id: string, updates: Partial<Document>): Promise<Document> => {
    setIsLoading(true);
    try {
      const document = await apiClient.put<Document>(`/documents/${id}`, updates);
      return document;
    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteDocument = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      await apiClient.delete(`/documents/${id}`);
    } catch (error) {
      console.error('Erro ao deletar documento:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signDocument = useCallback(async (
    documentId: string,
    signatureId: string,
    comment?: string
  ): Promise<Document> => {
    setIsLoading(true);
    try {
      const document = await apiClient.post<Document>(`/documents/${documentId}/sign`, {
        signatureId,
        comment,
      });
      return document;
    } catch (error) {
      console.error('Erro ao assinar documento:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Users
  const fetchUsers = useCallback(async (): Promise<User[]> => {
    try {
      const users = await apiClient.get<User[]>('/users');
      return users;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  }, []);

  const fetchCurrentUser = useCallback(async (): Promise<User> => {
    try {
      const user = await apiClient.get<User>('/users/current');
      return user;
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      throw error;
    }
  }, []);

  return {
    isLoading,
    fetchDocuments,
    fetchDocumentById,
    createDocument,
    updateDocument,
    deleteDocument,
    signDocument,
    fetchUsers,
    fetchCurrentUser,
  };
}

