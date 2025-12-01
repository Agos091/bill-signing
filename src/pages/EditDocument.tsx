import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';

export function EditDocument() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { documents, updateDocument, isLoading } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const document = documents.find((d) => d.id === id);

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setDescription(document.description);
      setExpiresAt(document.expiresAt || '');
    }
  }, [document]);

  if (!document) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Documento não encontrado</p>
          <button
            onClick={() => navigate('/documents')}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
          >
            Voltar para documentos
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      await updateDocument(id!, {
        title,
        description,
        expiresAt: expiresAt || undefined,
      });
      toast.success('Documento atualizado com sucesso!');
      navigate(`/documents/${id}`);
    } catch (error) {
      toast.error('Erro ao atualizar documento');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(`/documents/${id}`)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Editar Documento
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Atualize as informações do documento
          </p>
        </div>
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

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => navigate(`/documents/${id}`)}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}
