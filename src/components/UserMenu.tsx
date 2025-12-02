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
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Menu do usuário"
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
          <span className="text-sm">{currentUser.avatar || '👤'}</span>
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {currentUser.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {currentUser.email}
          </p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 animate-fade-in">
          {/* Header do menu */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {currentUser.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {currentUser.email}
            </p>
          </div>

          {/* Itens do menu */}
          <div className="py-1">
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.divider && (
                  <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
                )}
                <button
                  onClick={item.onClick}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
