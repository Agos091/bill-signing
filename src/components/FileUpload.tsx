import { useState, useRef } from 'react';
import { Upload, File, X, Loader2, FileText, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config/api';

export interface UploadedFile {
  id: string;
  filename: string;
  url: string;
  content: string;
  metadata: {
    filename: string;
    mimeType: string;
    size: number;
    pages?: number;
    rows?: number;
  };
}

interface FileUploadProps {
  onFileUploaded: (file: UploadedFile) => void;
  onFileRemoved?: () => void;
  maxSizeMB?: number;
  acceptedTypes?: string;
}

export function FileUpload({
  onFileUploaded,
  onFileRemoved,
  maxSizeMB = 10,
  acceptedTypes = '.pdf,.csv,.txt,.md,.doc,.docx,.xls,.xlsx',
}: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    // Validação de tamanho
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB`);
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Obtém o token de autenticação
      const stored = localStorage.getItem('bill-signing-auth');
      let token: string | null = null;
      if (stored) {
        try {
          const { session } = JSON.parse(stored);
          token = session?.access_token || null;
        } catch {
          // Ignora erro de parse
        }
      }

      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Log para debug (remover em produção se necessário)
      console.log('Upload URL:', `${API_BASE_URL}/upload`);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (response.status === 401) {
        localStorage.removeItem('bill-signing-auth');
        window.location.href = '/login';
        throw new Error('Sessão expirada');
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
        throw new Error(error.error || `Erro ao fazer upload: ${response.status}`);
      }

      const uploaded: UploadedFile = await response.json();
      setUploadedFile(uploaded);
      onFileUploaded(uploaded);
      toast.success('Arquivo enviado com sucesso!');
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    if (uploadedFile) {
      // Opcional: deletar arquivo do servidor
      apiClient.delete(`/upload/${uploadedFile.id}`).catch(console.error);
    }
    setUploadedFile(null);
    if (onFileRemoved) {
      onFileRemoved();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/pdf') {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    if (mimeType === 'text/csv' || mimeType.includes('spreadsheet')) {
      return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
    }
    return <File className="w-5 h-5 text-blue-500" />;
  };

  if (uploadedFile) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {getFileIcon(uploadedFile.metadata.mimeType)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {uploadedFile.filename}
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>{formatFileSize(uploadedFile.metadata.size)}</span>
                {uploadedFile.metadata.pages && (
                  <>
                    <span>•</span>
                    <span>{uploadedFile.metadata.pages} páginas</span>
                  </>
                )}
                {uploadedFile.metadata.rows && (
                  <>
                    <span>•</span>
                    <span>{uploadedFile.metadata.rows} linhas</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            aria-label="Remover arquivo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
        dragActive
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleChange}
        accept={acceptedTypes}
        className="hidden"
        id="file-upload"
        disabled={isUploading}
      />
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center cursor-pointer"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-8 h-8 text-primary-600 dark:text-primary-400 animate-spin mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Enviando arquivo...</p>
          </>
        ) : (
          <>
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Clique para fazer upload ou arraste o arquivo aqui
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {acceptedTypes} (máx. {maxSizeMB}MB)
            </p>
          </>
        )}
      </label>
    </div>
  );
}


