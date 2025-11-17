import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';

export function CreateDocument() {
  const navigate = useNavigate();
  const { createDocument, users, isLoading } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [signatures, setSignatures] = useState<Array<{ userEmail: string; userName: string }>>([]);
  const [newSignatureEmail, setNewSignatureEmail] = useState('');
  const [newSignatureName, setNewSignatureName] = useState('');

  const handleAddSignature = () => {
    if (!newSignatureEmail || !newSignatureName) {
      toast.error('Preencha email e nome');
      return;
    }

    if (signatures.some((s) => s.userEmail === newSignatureEmail)) {
      toast.error('Este email já foi adicionado');
      return;
    }

    setSignatures([...signatures, { userEmail: newSignatureEmail, userName: newSignatureName }]);
    setNewSignatureEmail('');
    setNewSignatureName('');
  };

  const handleRemoveSignature = (email: string) => {
    setSignatures(signatures.filter((s) => s.userEmail !== email));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (signatures.length === 0) {
      toast.error('Adicione pelo menos uma assinatura');
      return;
    }

    try {
      await createDocument({
        title,
        description,
        signatures,
        expiresAt: expiresAt || undefined,
      });
      toast.success('Documento criado com sucesso!');
      navigate('/documents');
    } catch (error) {
      toast.error('Erro ao criar documento');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Novo Documento
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Crie um novo documento e adicione os signatários
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Título *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Ex: Contrato de Prestação de Serviços"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descrição *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            placeholder="Descreva o conteúdo do documento..."
            required
          />
        </div>

        <div>
          <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Data de Expiração (opcional)
          </label>
          <input
            id="expiresAt"
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Signatários *
          </label>
          
          <div className="space-y-3 mb-4">
            {signatures.map((sig) => (
              <div
                key={sig.userEmail}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{sig.userName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{sig.userEmail}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSignature(sig.userEmail)}
                  className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newSignatureName}
              onChange={(e) => setNewSignatureName(e.target.value)}
              placeholder="Nome"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <input
              type="email"
              value={newSignatureEmail}
              onChange={(e) => setNewSignatureEmail(e.target.value)}
              placeholder="Email"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleAddSignature}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => navigate('/documents')}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Criando...' : 'Criar Documento'}
          </button>
        </div>
      </form>
    </div>
  );
}
