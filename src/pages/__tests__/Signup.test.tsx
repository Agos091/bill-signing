import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Signup } from '../Signup';
import { AuthProvider } from '../../context/AuthContext';

// Mock do react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock do toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock do Supabase
vi.mock('../../config/supabase', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
    },
    from: vi.fn(),
  },
}));

describe('Signup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render signup form', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Criar conta/i)).toBeDefined();
    expect(screen.getByLabelText(/Nome/i)).toBeDefined();
    expect(screen.getByLabelText(/Email/i)).toBeDefined();
    expect(screen.getByLabelText(/Senha/i)).toBeDefined();
  });

  it('should update name input', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText(/Nome/i) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'Test User' } });

    expect(nameInput.value).toBe('Test User');
  });

  it('should update email input', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput.value).toBe('test@example.com');
  });

  it('should show link to login', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </BrowserRouter>
    );

    const loginLink = screen.getByText(/Já tem uma conta/i);
    expect(loginLink).toBeDefined();
  });
});

