import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, CheckCircle2, Clock, XCircle, Trash2, Edit, Pen } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/Modal';
import { AIAnalysis } from '../components/AIAnalysis';

export function DocumentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { documents, deleteDocument, signDocument, isLoading } = useApp();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [signComment, setSignComment] = useState('');
  const [signingId, setSigningId] = useState<string | null>(null);

  const document = documents.find((d) => d.id === id);

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

  const handleDelete = async () => {
    try {
      await deleteDocument(document.id);
      toast.success('Documento excluído com sucesso');
      navigate('/documents');
    } catch (error) {
      toast.error('Erro ao excluir documento');
    }
    setShowDeleteModal(false);
  };

  const handleSign = async (signatureId: string) => {
    setSigningId(signatureId);
    setShowSignModal(true);
  };

  const confirmSign = async () => {
    if (!signingId) return;
    
    try {
      await signDocument(document.id, signingId, signComment);
      toast.success('Documento assinado com sucesso!');
      setShowSignModal(false);
      setSignComment('');
      setSigningId(null);
    } catch (error) {
      toast.error('Erro ao assinar documento');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusConfig = {
    pending: { label: 'Pendente', icon: Clock, color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' },
    signed: { label: 'Assinado', icon: CheckCircle2, color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' },
    rejected: { label: 'Rejeitado', icon: XCircle, color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' },
    expired: { label: 'Expirado', icon: Clock, color: 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800' },
  };

  const StatusIcon = statusConfig[document.status].icon;
  const statusStyle = statusConfig[document.status];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/documents')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Detalhes do Documento
          </h1>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {document.title}
              </h2>
              <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusStyle.color}`}>
                <StatusIcon className="w-4 h-4" />
                <span>{statusStyle.label}</span>
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {document.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Criado em</p>
              <p className="text-gray-900 dark:text-white font-medium">
                {formatDate(document.createdAt)}
              </p>
            </div>
          </div>
          {document.expiresAt && (
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Expira em</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {formatDate(document.expiresAt)}
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Criado por</p>
              <p className="text-gray-900 dark:text-white font-medium">
                {document.createdBy.name}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Assinaturas ({document.signatures.filter((s) => s.status === 'signed').length}/{document.signatures.length})
          </h3>
          <div className="space-y-3">
            {document.signatures.map((signature) => (
              <div
                key={signature.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {signature.userName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {signature.userEmail}
                    </p>
                    {signature.signedAt && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Assinado em {formatDate(signature.signedAt)}
                      </p>
                    )}
                    {signature.comment && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 italic">
                        "{signature.comment}"
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {signature.status === 'pending' ? (
                    <button
                      onClick={() => handleSign(signature.id)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                      disabled={isLoading}
                    >
                      <Pen className="w-4 h-4" />
                      <span>Assinar</span>
                    </button>
                  ) : signature.status === 'signed' ? (
                    <span className="inline-flex items-center space-x-1 text-green-600 dark:text-green-400">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-medium">Assinado</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-red-600 dark:text-red-400">
                      <XCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Rejeitado</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => navigate(`/documents/${document.id}/edit`)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Editar</span>
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Excluir</span>
          </button>
        </div>
      </div>

      {/* Análise Inteligente com IA */}
      <AIAnalysis documentId={document.id} />

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar exclusão"
        size="md"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita.
        </p>
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Excluir
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={showSignModal}
        onClose={() => {
          setShowSignModal(false);
          setSignComment('');
          setSigningId(null);
        }}
        title="Assinar Documento"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Adicione um comentário opcional antes de assinar:
          </p>
          <textarea
            value={signComment}
            onChange={(e) => setSignComment(e.target.value)}
            placeholder="Comentário (opcional)"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              onClick={() => {
                setShowSignModal(false);
                setSignComment('');
                setSigningId(null);
              }}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={confirmSign}
              disabled={isLoading}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Assinando...' : 'Confirmar Assinatura'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
