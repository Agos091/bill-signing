import { Calendar, Clock, User, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Document } from '../types';

interface DocumentCardProps {
  document: Document;
}

const statusConfig = {
  pending: {
    label: 'Pendente',
    icon: Clock,
    color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
  },
  signed: {
    label: 'Assinado',
    icon: CheckCircle2,
    color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
  },
  rejected: {
    label: 'Rejeitado',
    icon: XCircle,
    color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
  },
  expired: {
    label: 'Expirado',
    icon: AlertCircle,
    color: 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800',
  },
};

export function DocumentCard({ document }: DocumentCardProps) {
  const StatusIcon = statusConfig[document.status].icon;
  const statusStyle = statusConfig[document.status];

  const signedCount = document.signatures.filter((s) => s.status === 'signed').length;
  const totalSignatures = document.signatures.length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Link
      to={`/documents/${document.id}`}
      className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] animate-fade-in"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate mb-1">
            {document.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {document.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span
          className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusStyle.color}`}
        >
          <StatusIcon className="w-4 h-4" />
          <span>{statusStyle.label}</span>
        </span>

        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
          <User className="w-4 h-4" />
          <span>
            {signedCount}/{totalSignatures}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>Criado em {formatDate(document.createdAt)}</span>
        </div>
        {document.expiresAt && (
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>Expira em {formatDate(document.expiresAt)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
