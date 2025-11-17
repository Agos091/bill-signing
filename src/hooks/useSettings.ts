import { useState, useEffect, useCallback } from 'react';

export interface AppSettings {
  // Aparência
  darkMode: boolean;
  // API
  apiBaseUrl: string;
  // IA
  aiProvider: 'openai' | 'anthropic';
  autoAnalyze: boolean;
  // Notificações
  emailNotifications: boolean;
  pushNotifications: boolean;
  // Geral
  language: string;
  dateFormat: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  aiProvider: 'openai',
  autoAnalyze: false,
  emailNotifications: true,
  pushNotifications: true,
  language: 'pt-BR',
  dateFormat: 'DD/MM/YYYY',
};

const SETTINGS_KEY = 'appSettings';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    let parsedSettings = DEFAULT_SETTINGS;
    
    if (stored) {
      try {
        parsedSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      } catch {
        parsedSettings = DEFAULT_SETTINGS;
      }
    }
    
    // Se darkMode não está nas settings, tenta carregar do localStorage antigo
    if (parsedSettings.darkMode === DEFAULT_SETTINGS.darkMode) {
      const oldDarkMode = localStorage.getItem('darkMode');
      if (oldDarkMode) {
        try {
          parsedSettings.darkMode = JSON.parse(oldDarkMode);
        } catch {
          // Ignora erro
        }
      }
    }
    
    return parsedSettings;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Salva as configurações no localStorage
  const saveSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setIsLoading(true);
    try {
      const updated = { ...settings, ...newSettings };
      setSettings(updated);
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      
      // Aplica dark mode imediatamente se mudou
      if (newSettings.darkMode !== undefined) {
        const root = document.documentElement;
        if (newSettings.darkMode) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
        // Sincroniza com localStorage antigo para compatibilidade
        localStorage.setItem('darkMode', JSON.stringify(newSettings.darkMode));
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  // Reseta para padrões
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    
    // Aplica dark mode padrão
    const root = document.documentElement;
    if (DEFAULT_SETTINGS.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  // Aplica dark mode na inicialização
  useEffect(() => {
    const root = document.documentElement;
    if (settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.darkMode]);

  return {
    settings,
    saveSettings,
    resetSettings,
    isLoading,
  };
}

