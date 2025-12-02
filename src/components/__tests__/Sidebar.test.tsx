import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Sidebar } from '../Sidebar';

// Mock do useApp
vi.mock('../../context/AppContext', () => ({
  useApp: () => ({
    currentUser: {
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      avatar: '👤',
    },
  }),
}));

describe('Sidebar', () => {
  it('should render sidebar with navigation items', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    // Verifica se há links de navegação
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });
});

