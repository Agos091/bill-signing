import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import { FileUpload, type UploadedFile } from '../components/FileUpload';

export function CreateDocument() {
  const navigate = useNavigate();
  const { createDocument, isLoading } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [signatures, setSignatures] = useState<Array<{ userEmail: string; userName: string }>>([]);
  const [signaturesError, setSignaturesError] = useState(false);
  const [newSignatureEmail, setNewSignatureEmail] = useState('');
  const [newSignatureName, setNewSignatureName] = useState('');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

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
    setSignaturesError(false);
    setNewSignatureEmail('');
    setNewSignatureName('');
  };

  const handleRemoveSignature = (email: string) => {
    const updated = signatures.filter((s) => s.userEmail !== email);
    setSignatures(updated);
    if (updated.length === 0) {
      setSignaturesError(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação: título ou arquivo é obrigatório
    if (!title && !uploadedFile) {
      toast.error('Preencha o título ou anexe um arquivo');
      return;
    }

    // Validação: descrição ou arquivo é obrigatório
    if (!description && !uploadedFile) {
      toast.error('Preencha a descrição ou anexe um arquivo');
      return;
    }

    if (signatures.length === 0) {
      toast.error('Adicione pelo menos uma assinatura');
      setSignaturesError(true);
      return;
    }

    try {
      // Se houver arquivo, usa o conteúdo extraído como descrição se descrição estiver vazia
      let finalDescription = description;
      if (uploadedFile && !description.trim()) {
        // Usa as primeiras 500 caracteres do conteúdo extraído
        finalDescription = uploadedFile.content.substring(0, 500) + (uploadedFile.content.length > 500 ? '...' : '');
      }

      await createDocument({
        title: title || uploadedFile?.filename || 'Novo Documento',
        description: finalDescription,
        signatures,
        expiresAt: expiresAt || undefined,
        fileUrl: uploadedFile?.url,
      });
      toast.success('Documento criado com sucesso!');
      navigate('/documents');
    } catch (error) {
      toast.error('Erro ao criar documento');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-gradient-to-br from-[#F5F9FF] via-white to-white rounded-[32px] border border-[#E0EDFF] p-8 shadow-[0_25px_70px_rgba(10,132,255,0.08)] space-y-4">
        <span className="uppercase text-xs tracking-[0.4em] text-blue-500">Documentos</span>
        <h1 className="text-4xl font-semibold text-[#0A192F]">
          Criar documento com IA e fluxo organizado
        </h1>
        <p className="text-gray-600">
          Defina título, descreva o escopo, adicione signatários e use IA para enriquecer o conteúdo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[32px] border border-[#E0EDFF] p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-[#0A192F] mb-2">
            Título {!uploadedFile && '*'}
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-[#E0EDFF] rounded-2xl bg-white text-gray-900 focus:ring-2 focus:ring-[#0A84FF]/20 focus:border-[#0A84FF]"
            placeholder="Ex: Contrato de Prestação de Serviços"
            required={!uploadedFile}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-[#0A192F] mb-2">
            Descrição {!uploadedFile && '*'}
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-[#E0EDFF] rounded-2xl bg-white text-gray-900 focus:ring-2 focus:ring-[#0A84FF]/20 focus:border-[#0A84FF] resize-none"
            placeholder={uploadedFile ? "Descreva o conteúdo do documento (opcional se arquivo foi enviado)..." : "Descreva o conteúdo do documento..."}
            required={!uploadedFile}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0A192F] mb-2">
            Anexar Arquivo (opcional)
          </label>
          <FileUpload
            onFileUploaded={(file) => {
              setUploadedFile(file);
              // Preenche título e descrição automaticamente se estiverem vazios
              if (!title && file.filename) {
                setTitle(file.filename.replace(/\.[^/.]+$/, ''));
              }
              if (!description && file.content) {
                setDescription(file.content.substring(0, 500) + (file.content.length > 500 ? '...' : ''));
              }
            }}
            onFileRemoved={() => setUploadedFile(null)}
          />
          <p className="mt-2 text-xs text-gray-500">
            Formatos suportados: PDF, CSV, TXT, MD, DOC, DOCX, XLS, XLSX (máx. 10MB)
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="expiresAt" className="block text-sm font-medium text-[#0A192F] mb-2">
            Data de Expiração (opcional)
          </label>
          <input
            id="expiresAt"
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="w-full px-4 py-3 border border-[#E0EDFF] rounded-2xl bg-white text-gray-900 focus:ring-2 focus:ring-[#0A84FF]/20 focus:border-[#0A84FF]"
          />
          {expiresAt && (
            <p className="text-sm text-gray-500">
              {new Date(expiresAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-[#0A192F]">
              Signatários *
            </label>
            {signaturesError && (
              <span className="text-xs text-red-600 font-medium">
                Adicione pelo menos um signatário
              </span>
            )}
          </div>
          
          <div className="space-y-3 mb-4">
            {signatures.map((sig) => (
              <div
                key={sig.userEmail}
                className="flex items-center justify-between p-4 bg-[#F5F9FF] rounded-2xl border border-[#EAF2FF]"
              >
                <div>
                  <p className="font-medium text-[#0A192F]">{sig.userName}</p>
                  <p className="text-sm text-gray-500">{sig.userEmail}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSignature(sig.userEmail)}
                  className="p-1 text-red-500 hover:bg-[#FFE4E4] rounded-full"
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

        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-[#EAF2FF]">
          <button
            type="button"
            onClick={() => navigate('/documents')}
            className="px-5 py-2 rounded-full border border-[#E0EDFF] text-[#0A192F] hover:bg-[#F5F9FF] transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-[#0A84FF] to-[#4BC0FF] text-white font-semibold shadow-[0_15px_40px_rgba(10,132,255,0.25)] hover:shadow-[0_15px_45px_rgba(10,132,255,0.35)] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Criando...' : 'Criar Documento'}
          </button>
        </div>
      </form>
    </div>
  );
}
