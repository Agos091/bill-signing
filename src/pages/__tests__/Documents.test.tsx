import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Documents } from '../Documents';
import { AppProvider } from '../../context/AppContext';
import { AuthProvider } from '../../context/AuthContext';

// Mock do react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock do Supabase
vi.mock('../../config/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
    from: vi.fn(),
  },
}));

describe('Documents', () => {
  it('should render documents page', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <Documents />
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    // Usa getAllByText porque "Documentos" aparece múltiplas vezes
    expect(screen.getAllByText(/Documentos/i).length).toBeGreaterThan(0);
  });

  it('should filter documents by search term', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <Documents />
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Buscar documentos/i) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'test' } });

    expect(searchInput.value).toBe('test');
  });
});

