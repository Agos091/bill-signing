import { FileText } from 'lucide-react';
import { UserMenu } from './UserMenu';

export function Header() {
  return (
    <header className="px-4 sm:px-6 lg:px-8 pt-6">
      <div className="glass-panel rounded-3xl px-6 sm:px-10 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center shadow-lg shadow-primary-500/40">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="uppercase tracking-[0.4em] text-xs text-slate-500">Bill Signing</p>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Painel de Assinaturas</h1>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
