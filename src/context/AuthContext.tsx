import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '../config/supabase';
import type { User } from '../types';

interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
}

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'bill-signing-auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega sessão do localStorage na inicialização
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const { user: storedUser, session: storedSession } = JSON.parse(stored);
        setUser(storedUser);
        setSession(storedSession);
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Salva sessão no localStorage quando muda
  useEffect(() => {
    if (user && session) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, session }));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user, session]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message === 'Invalid login credentials' 
          ? 'Email ou senha incorretos' 
          : error.message);
      }

      if (!data.user || !data.session) {
        throw new Error('Erro ao fazer login');
      }

      // Busca dados do profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const userData: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: profile?.name || data.user.email?.split('@')[0] || 'Usuário',
        avatar: profile?.avatar || '👤',
      };

      setUser(userData);
      setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            avatar: '👤',
          },
        },
      });

      if (error) {
        if (error.message.includes('already')) {
          throw new Error('Este email já está cadastrado');
        }
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Erro ao criar conta');
      }

      // Se o email precisa de confirmação
      if (!data.session) {
        throw new Error('Conta criada! Verifique seu email para confirmar.');
      }

      const userData: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: name || data.user.email?.split('@')[0] || 'Usuário',
        avatar: '👤',
      };

      setUser(userData);
      setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAccessToken = useCallback(() => {
    return session?.access_token || null;
  }, [session]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!user && !!session,
        login,
        signup,
        logout,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

