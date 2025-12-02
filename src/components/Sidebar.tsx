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
    <aside className="w-72 bg-gradient-to-b from-[#EAF2FF] via-white to-white border-r border-[#E0EDFF] min-h-screen text-gray-900">
      <div className="px-6 py-8 space-y-8">
        <div className="space-y-1">
          <p className="uppercase text-[11px] tracking-[0.4em] text-blue-500">Bill Signing</p>
          <h2 className="text-2xl font-semibold text-[#0A192F]">Documentação inteligente</h2>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all ${
                  isActive
                    ? 'border-[#0A84FF]/20 bg-white shadow-[0_12px_30px_rgba(10,132,255,0.12)] text-[#0A84FF]'
                    : 'border-transparent text-gray-500 hover:bg-white hover:border-[#E3EDFF]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center justify-center w-9 h-9 rounded-2xl ${
                      isActive ? 'bg-[#E0F0FF]' : 'bg-[#F4F7FF]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.path === '/ai' && (
                      <span className="text-[11px] uppercase tracking-[0.3em] text-blue-300">
                        IA
                      </span>
                    )}
                  </div>
                </div>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#0A84FF] shadow-[0_0_0_6px_rgba(10,132,255,0.15)]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
