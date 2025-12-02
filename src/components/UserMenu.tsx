import { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, Moon, Sun, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export function UserMenu() {
  const { currentUser, isDarkMode, toggleDarkMode } = useApp();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fecha o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Se não há usuário logado, não renderiza o menu
  if (!currentUser) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logout realizado com sucesso!');
      navigate('/login');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
    setIsOpen(false);
  };

  const menuItems = [
    {
      icon: User,
      label: 'Meu Perfil',
      onClick: () => {
        navigate('/settings');
        setIsOpen(false);
      },
    },
    {
      icon: Settings,
      label: 'Configurações',
      onClick: () => {
        navigate('/settings');
        setIsOpen(false);
      },
    },
    {
      icon: isDarkMode ? Sun : Moon,
      label: isDarkMode ? 'Modo Claro' : 'Modo Escuro',
      onClick: () => {
        toggleDarkMode();
        setIsOpen(false);
      },
    },
    {
      icon: LogOut,
      label: 'Sair',
      onClick: handleLogout,
      divider: true,
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all ${
          isOpen ? 'border-[#0A84FF]/30 bg-white shadow-[0_12px_30px_rgba(10,132,255,0.15)]' : 'border-[#E3EDFF] bg-white/80 hover:border-[#0A84FF]/20'
        }`}
        aria-label="Menu do usuário"
        aria-expanded={isOpen}
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0A84FF] to-[#4BC0FF] flex items-center justify-center text-white text-sm shadow-[0_8px_20px_rgba(10,132,255,0.4)]">
          <span>{currentUser.avatar || '👤'}</span>
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-semibold text-[#0A192F]">
            {currentUser.name}
          </p>
          <p className="text-xs text-gray-500">
            {currentUser.email}
          </p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-[#0A84FF] transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white/90 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_rgba(10,132,255,0.15)] border border-[#E3EDFF] py-3 z-50 animate-fade-in">
          <div className="px-5 pb-3 border-b border-[#EAF2FF]">
            <p className="text-sm font-semibold text-[#0A192F]">
              {currentUser.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {currentUser.email}
            </p>
          </div>

          <div className="py-2">
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.divider && (
                  <div className="my-2 border-t border-[#EAF2FF]" />
                )}
                <button
                  onClick={item.onClick}
                  className="w-full flex items-center justify-between px-5 py-2.5 text-sm text-gray-600 hover:bg-[#F3F8FF] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-2xl bg-[#F3F8FF] text-[#0A84FF]">
                      <item.icon className="w-4 h-4" />
                    </span>
                    <span className="text-gray-700 font-medium">{item.label}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400">→</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
