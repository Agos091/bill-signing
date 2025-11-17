import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Document, User, CreateDocumentData } from '../types';
import { initialDocuments, currentUser, mockUsers } from '../mocks/data';
import { useMockApi } from '../hooks/useMockApi';

interface AppContextType {
  documents: Document[];
  currentUser: User;
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
  // Carrega documentos diretamente na inicialização do estado
  const [documents, setDocuments] = useState<Document[]>(() => {
    const stored = localStorage.getItem('documents');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return false;
      }
    }
    // Verifica também nas settings unificadas
    const settingsStored = localStorage.getItem('appSettings');
    if (settingsStored) {
      try {
        const settings = JSON.parse(settingsStored);
        return settings.darkMode ?? false;
      } catch {
        return false;
      }
    }
    return false;
  });
  
  const api = useMockApi();

  const refreshDocuments = useCallback(async () => {
    const docs = await api.fetchDocuments();
    setDocuments(docs);
  }, [api]);

  useEffect(() => {
    // Aplica tema na inicialização
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Inicializa documentos no localStorage se não existirem
    const stored = localStorage.getItem('documents');
    if (!stored) {
      localStorage.setItem('documents', JSON.stringify(initialDocuments));
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      setDocuments(initialDocuments);
    }
    // Se já existem, os documentos já foram carregados no useState inicial
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Sincroniza com appSettings se existir
    const settingsStored = localStorage.getItem('appSettings');
    if (settingsStored) {
      try {
        const settings = JSON.parse(settingsStored);
        settings.darkMode = isDarkMode;
        localStorage.setItem('appSettings', JSON.stringify(settings));
      } catch {
        // Ignora erro
      }
    }
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

  return (
    <AppContext.Provider
      value={{
        documents,
        currentUser,
        users: mockUsers,
        isLoading: api.isLoading,
        isDarkMode,
        toggleDarkMode: () => {
          setIsDarkMode((prev) => {
            const newValue = !prev;
            // Sincroniza com appSettings se existir
            const settingsStored = localStorage.getItem('appSettings');
            if (settingsStored) {
              try {
                const settings = JSON.parse(settingsStored);
                settings.darkMode = newValue;
                localStorage.setItem('appSettings', JSON.stringify(settings));
              } catch {
                // Ignora erro
              }
            }
            return newValue;
          });
        },
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
