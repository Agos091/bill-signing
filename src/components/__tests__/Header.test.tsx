import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '../Header';

// Mock do UserMenu para evitar dependências complexas
vi.mock('../UserMenu', () => ({
  UserMenu: () => <div data-testid="user-menu">User Menu</div>,
}));

describe('Header', () => {
  it('should render header component', () => {
    render(<Header />);
    const header = screen.getByRole('banner');
    expect(header).toBeDefined();
    expect(screen.getByText('Bill Signing')).toBeDefined();
  });
});

