const HOST_MAP: Record<string, string> = {
  'bill-signing-ogl4.vercel.app': 'https://bill-signing-production.up.railway.app/api',
};

function resolveApiBaseUrl(): string {
  // Prioridade 1: Variável de ambiente explícita
  const envValue = import.meta.env.VITE_API_BASE_URL?.trim();
  if (envValue) {
    return envValue.replace(/\/$/, '');
  }

  // Prioridade 2: Mapeamento por hostname (produção)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (HOST_MAP[hostname]) {
      return HOST_MAP[hostname];
    }
    
    // Se estiver no Vercel (qualquer subdomínio), usa Railway
    if (hostname.includes('vercel.app')) {
      return 'https://bill-signing-production.up.railway.app/api';
    }
  }

  // Fallback: desenvolvimento local
  return 'http://localhost:3001/api';
}

export const API_BASE_URL = resolveApiBaseUrl();

// Função para obter o token do localStorage
function getAuthToken(): string | null {
  const stored = localStorage.getItem('bill-signing-auth');
  if (stored) {
    try {
      const { session } = JSON.parse(stored);
      return session?.access_token || null;
    } catch {
      return null;
    }
  }
  return null;
}

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (response.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('bill-signing-auth');
      window.location.href = '/login';
      throw new Error('Sessão expirada');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (response.status === 401) {
      localStorage.removeItem('bill-signing-auth');
      window.location.href = '/login';
      throw new Error('Sessão expirada');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (response.status === 401) {
      localStorage.removeItem('bill-signing-auth');
      window.location.href = '/login';
      throw new Error('Sessão expirada');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async delete<T>(endpoint: string): Promise<T> {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    if (response.status === 401) {
      localStorage.removeItem('bill-signing-auth');
      window.location.href = '/login';
      throw new Error('Sessão expirada');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  },
};
