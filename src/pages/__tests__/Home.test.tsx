import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Home } from '../Home';
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

describe('Home', () => {
  it('should render home page', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <Home />
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    // Verifica se a página renderiza com o título Dashboard
    expect(screen.getByText(/Dashboard/i)).toBeDefined();
  });
});

