import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 gap-6">
        <Sidebar />
        <main className="flex-1">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 lg:p-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
