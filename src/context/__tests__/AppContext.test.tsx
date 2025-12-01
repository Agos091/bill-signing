import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AppProvider, useApp } from '../AppContext';
import { ReactNode } from 'react';

const TestComponent = () => {
  const { documents, currentUser, isLoading } = useApp();
  return (
    <div>
      <div data-testid="documents-count">{documents.length}</div>
      <div data-testid="user-name">{currentUser.name}</div>
      <div data-testid="loading">{isLoading ? 'loading' : 'not-loading'}</div>
    </div>
  );
};

describe('AppContext', () => {
  it('should provide app context', () => {
    const { getByTestId } = render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );
    expect(getByTestId('documents-count')).toBeDefined();
    expect(getByTestId('user-name')).toBeDefined();
    expect(getByTestId('loading')).toBeDefined();
  });
});

