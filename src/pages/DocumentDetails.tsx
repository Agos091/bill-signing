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
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/documents')}
          className="p-3 rounded-2xl border border-[#EAF2FF] bg-white hover:bg-[#F5F9FF] shadow-[0_15px_30px_rgba(15,23,42,0.08)] text-[#0A84FF] transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 space-y-1">
          <p className="text-xs uppercase tracking-[0.4em] text-blue-500">Documento</p>
          <h1 className="text-3xl font-semibold text-[#0A192F]">
            Detalhes do documento
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-[#E0EDFF] p-8 shadow-[0_25px_70px_rgba(10,132,255,0.08)] space-y-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h2 className="text-3xl font-semibold text-[#0A192F]">
                {document.title}
              </h2>
              <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium ${statusStyle.color}`}>
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/80 text-current">
                  <StatusIcon className="w-3 h-3" />
                </span>
                {statusStyle.label}
              </span>
            </div>
            <p className="text-gray-500 mb-6">
              {document.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-[#EAF2FF]">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#0A84FF]" />
            <div>
              <p className="text-sm text-gray-400">Criado em</p>
              <p className="text-[#0A192F] font-medium">
                {formatDate(document.createdAt)}
              </p>
            </div>
          </div>
          {document.expiresAt && (
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#0A84FF]" />
              <div>
                <p className="text-sm text-gray-400">Expira em</p>
                <p className="text-[#0A192F] font-medium">
                  {formatDate(document.expiresAt)}
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-[#0A84FF]" />
            <div>
              <p className="text-sm text-gray-400">Criado por</p>
              <p className="text-[#0A192F] font-medium">
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
                className="flex items-center justify-between p-4 bg-[#F5F9FF] rounded-2xl border border-[#EAF2FF]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0A84FF] to-[#4BC0FF] flex items-center justify-center text-white">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-[#0A192F]">
                      {signature.userName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {signature.userEmail}
                    </p>
                    {signature.signedAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        Assinado em {formatDate(signature.signedAt)}
                      </p>
                    )}
                    {signature.comment && (
                      <p className="text-sm text-gray-600 mt-1 italic">
                        "{signature.comment}"
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {signature.status === 'pending' ? (
                    <button
                      onClick={() => handleSign(signature.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#0A84FF] to-[#4BC0FF] text-white rounded-full text-sm font-medium shadow-[0_10px_30px_rgba(10,132,255,0.2)] transition"
                      disabled={isLoading}
                    >
                      <Pen className="w-4 h-4" />
                      <span>Assinar</span>
                    </button>
                  ) : signature.status === 'signed' ? (
                    <span className="inline-flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-medium">Assinado</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-500">
                      <XCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Rejeitado</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-4 border-t border-[#EAF2FF]">
          <button
            onClick={() => navigate(`/documents/${document.id}/edit`)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#E0EDFF] text-[#0A192F] hover:bg-[#F5F9FF] transition"
          >
            <Edit className="w-4 h-4" />
            <span>Editar</span>
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FFE4E4] text-red-600 hover:bg-[#FFD4D4] transition"
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
        <p className="text-gray-500 mb-6">
          Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita.
        </p>
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 rounded-full border border-[#E0EDFF] text-[#0A192F] hover:bg-[#F5F9FF] transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#EF4444] text-white font-semibold shadow-[0_15px_40px_rgba(239,68,68,0.3)] hover:opacity-90 transition"
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
