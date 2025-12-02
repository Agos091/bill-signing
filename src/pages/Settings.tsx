import { useState, useEffect } from 'react';
import {
  Moon,
  Sun,
  Globe,
  Server,
  Sparkles,
  Bell,
  User,
  RefreshCw,
  Save,
  AlertCircle,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSettings } from '../hooks/useSettings';
import toast from 'react-hot-toast';
import { Modal } from '../components/Modal';

export function Settings() {
  const { currentUser } = useApp();
  const { settings, saveSettings, resetSettings, isLoading } = useSettings();
  const [showResetModal, setShowResetModal] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  // Atualiza localSettings quando settings mudam externamente
  useEffect(() => {
    setLocalSettings(settings);
    setHasChanges(false);
  }, [settings]);

  const handleChange = (key: keyof typeof settings, value: unknown) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    saveSettings(localSettings);
    setHasChanges(false);
    toast.success('Configurações salvas com sucesso!');
  };

  const handleReset = () => {
    resetSettings();
    setLocalSettings(settings);
    setHasChanges(false);
    setShowResetModal(false);
    toast.success('Configurações resetadas para os padrões');
  };

  const testApiConnection = async () => {
    try {
      const response = await fetch(`${localSettings.apiBaseUrl.replace('/api', '')}/health`);
      if (response.ok) {
        toast.success('Conexão com a API bem-sucedida!');
      } else {
        toast.error('Erro ao conectar com a API');
      }
    } catch (error) {
      toast.error('Não foi possível conectar com a API');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Configurações
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie suas preferências e configurações do sistema
        </p>
      </div>

      {/* Barra de ações */}
      {hasChanges && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm text-yellow-800 dark:text-yellow-300">
              Você tem alterações não salvas
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setLocalSettings(settings);
                setHasChanges(false);
              }}
              className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Salvar</span>
            </button>
          </div>
        </div>
      )}

      {/* Perfil do Usuário */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
            <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Perfil do Usuário
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome
            </label>
            <input
              type="text"
              value={currentUser?.name || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={currentUser?.email || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Aparência */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            {localSettings.darkMode ? (
              <Moon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            ) : (
              <Sun className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            )}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Aparência
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Modo Escuro
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Ative o tema escuro para reduzir o cansaço visual
              </p>
            </div>
            <button
              onClick={() => handleChange('darkMode', !localSettings.darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.darkMode ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Configurações de API */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Server className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Configurações de API
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL Base da API
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={localSettings.apiBaseUrl}
                onChange={(e) => handleChange('apiBaseUrl', e.target.value)}
                placeholder="http://localhost:3001/api"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                onClick={testApiConnection}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Testar</span>
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
              <Info className="w-4 h-4" />
              <span>URL completa da API do backend (incluindo /api)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Configurações de IA */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Assistente de IA
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Provedor de IA
            </label>
            <select
              value={localSettings.aiProvider}
              onChange={(e) => handleChange('aiProvider', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="openai">OpenAI (GPT-4o-mini)</option>
              <option value="anthropic">Anthropic (Claude 3.5 Sonnet)</option>
            </select>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Escolha o provedor de IA para análises e sugestões
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Análise Automática
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Analisar documentos automaticamente ao visualizar
              </p>
            </div>
            <button
              onClick={() => handleChange('autoAnalyze', !localSettings.autoAnalyze)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.autoAnalyze ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.autoAnalyze ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Notificações */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
            <Bell className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Notificações
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notificações por Email
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receba notificações por email sobre documentos
              </p>
            </div>
            <button
              onClick={() => handleChange('emailNotifications', !localSettings.emailNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.emailNotifications ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notificações Push
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receba notificações no navegador
              </p>
            </div>
            <button
              onClick={() => handleChange('pushNotifications', !localSettings.pushNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.pushNotifications ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Geral */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <Globe className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Geral
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Idioma
            </label>
            <select
              value={localSettings.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Formato de Data
            </label>
            <select
              value={localSettings.dateFormat}
              onChange={(e) => handleChange('dateFormat', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Resetar Configurações
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Restaura todas as configurações para os valores padrão
            </p>
          </div>
          <button
            onClick={() => setShowResetModal(true)}
            className="px-4 py-2 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Resetar</span>
          </button>
        </div>
      </div>

      {/* Modal de confirmação de reset */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Resetar Configurações"
        size="md"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Tem certeza que deseja resetar todas as configurações para os valores padrão? Esta ação não pode ser desfeita.
        </p>
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={() => setShowResetModal(false)}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Resetar
          </button>
        </div>
      </Modal>
    </div>
  );
}
