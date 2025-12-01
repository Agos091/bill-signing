import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Document, User, CreateDocumentData } from '../types';
import { useApi } from '../hooks/useApi';
import { useAuth } from './AuthContext';

interface AppContextType {
  documents: Document[];
  currentUser: User | null;
  users: User[];
  isLoading: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  refreshDocuments: () => Promise<void>;
  createDocument: (data: CreateDocumentData) => Promise<Document>;
  updateDocument: (id: string, updates: Partial<Document>) => Promise<Document>;
  deleteDocument: (id: string) => Promise<void>;
  signDocument: (documentId: string, signatureId: string, comment?: string) => Promise<Document>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user: authUser } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return false;
      }
    }
    return false;
  });
  
  const api = useApi();

  // Carrega dados iniciais do backend
  const loadInitialData = useCallback(async () => {
    if (!authUser) {
      setIsInitialized(true);
      return;
    }

    try {
      const [docsData, usersData] = await Promise.all([
        api.fetchDocuments(),
        api.fetchUsers(),
      ]);
      
      setDocuments(docsData);
      setUsers(usersData);
      setIsInitialized(true);
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
      setIsInitialized(true);
    }
  }, [api, authUser]);

  const refreshDocuments = useCallback(async () => {
    try {
      const docs = await api.fetchDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Erro ao atualizar documentos:', error);
    }
  }, [api]);

  // Inicialização
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Aplica tema
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const handleCreateDocument = async (data: CreateDocumentData) => {
    const doc = await api.createDocument(data);
    await refreshDocuments();
    return doc;
  };

  const handleUpdateDocument = async (id: string, updates: Partial<Document>) => {
    const doc = await api.updateDocument(id, updates);
    await refreshDocuments();
    return doc;
  };

  const handleDeleteDocument = async (id: string) => {
    await api.deleteDocument(id);
    await refreshDocuments();
  };

  const handleSignDocument = async (
    documentId: string,
    signatureId: string,
    comment?: string
  ) => {
    const doc = await api.signDocument(documentId, signatureId, comment);
    await refreshDocuments();
    return doc;
  };

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev: boolean) => !prev);
  }, []);

  // Mostra loading enquanto inicializa
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        documents,
        currentUser: authUser,
        users,
        isLoading: api.isLoading,
        isDarkMode,
        toggleDarkMode,
        refreshDocuments,
        createDocument: handleCreateDocument,
        updateDocument: handleUpdateDocument,
        deleteDocument: handleDeleteDocument,
        signDocument: handleSignDocument,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
