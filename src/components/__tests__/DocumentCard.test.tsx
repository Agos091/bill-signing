import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DocumentCard } from '../DocumentCard';
import type { Document } from '../../types';

const mockDocument: Document = {
  id: 'doc-1',
  title: 'Test Document',
  description: 'Test Description',
  status: 'pending',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  createdBy: {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    avatar: '👤',
  },
  signatures: [
    { id: 'sig-1', userId: 'user-1', userName: 'User 1', userEmail: 'user1@test.com', status: 'pending' },
    { id: 'sig-2', userId: 'user-2', userName: 'User 2', userEmail: 'user2@test.com', status: 'signed' },
  ],
};

describe('DocumentCard', () => {
  it('should render document card with title and description', () => {
    render(
      <BrowserRouter>
        <DocumentCard document={mockDocument} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Document')).toBeDefined();
    expect(screen.getByText('Test Description')).toBeDefined();
  });

  it('should display pending status', () => {
    render(
      <BrowserRouter>
        <DocumentCard document={mockDocument} />
      </BrowserRouter>
    );

    expect(screen.getByText('Pendente')).toBeDefined();
  });

  it('should display signed status', () => {
    const signedDoc = { ...mockDocument, status: 'signed' as const };
    render(
      <BrowserRouter>
        <DocumentCard document={signedDoc} />
      </BrowserRouter>
    );

    expect(screen.getByText('Assinado')).toBeDefined();
  });

  it('should display signature count', () => {
    render(
      <BrowserRouter>
        <DocumentCard document={mockDocument} />
      </BrowserRouter>
    );

    expect(screen.getByText('1/2')).toBeDefined();
  });

  it('should display expiration date when provided', () => {
    const docWithExpiry = { ...mockDocument, expiresAt: '2024-12-31T00:00:00Z' };
    render(
      <BrowserRouter>
        <DocumentCard document={docWithExpiry} />
      </BrowserRouter>
    );

    expect(screen.getByText(/Expira em/)).toBeDefined();
  });

  it('should link to document details page', () => {
    render(
      <BrowserRouter>
        <DocumentCard document={mockDocument} />
      </BrowserRouter>
    );

    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/documents/doc-1');
  });
});

