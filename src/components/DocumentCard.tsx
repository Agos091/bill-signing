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
    <Link to={`/documents/${document.id}`} className="apple-card block space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400 mb-2">Documento</p>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white truncate">{document.title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{document.description}</p>
        </div>
        <span
          className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusStyle.color}`}
        >
          <StatusIcon className="w-3.5 h-3.5" />
          <span>{statusStyle.label}</span>
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-xs text-slate-400 uppercase tracking-[0.2em]">Assinaturas</p>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-300">
              <User className="w-4 h-4" />
              <span className="font-medium">
                {signedCount}/{totalSignatures}
              </span>
            </div>
            {totalSignatures > 0 && (
              <div className="w-28 bg-white/60 dark:bg-white/10 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-1.5 rounded-full transition-all"
                  style={{ width: `${(signedCount / totalSignatures) * 100}%` }}
                />
              </div>
            )}
          </div>
        </div>
        <div className="text-right text-sm text-slate-500 dark:text-slate-300 space-y-1">
          <div className="flex items-center space-x-1 justify-end">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(document.createdAt)}</span>
          </div>
          {document.expiresAt && (
            <div className="flex items-center space-x-1 justify-end">
              <Clock className="w-4 h-4" />
              <span>{formatDate(document.expiresAt)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
