import { Home, FileText, Plus, Settings, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/documents', label: 'Documentos', icon: FileText },
  { path: '/create', label: 'Novo Documento', icon: Plus },
  { path: '/ai', label: 'Assistente IA', icon: Sparkles },
  { path: '/settings', label: 'Configurações', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:block w-64">
      <div className="glass-panel rounded-3xl p-6 sticky top-10 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-primary-500/90 to-primary-600/90 text-white shadow-lg shadow-primary-500/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                    isActive
                      ? 'bg-white/30 text-white'
                      : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <span className="font-medium">{item.label}</span>
              </div>
              {isActive && <span className="w-2 h-2 rounded-full bg-white" />}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
