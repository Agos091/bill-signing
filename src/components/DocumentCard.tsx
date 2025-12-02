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
    color: 'text-[#FFB020] bg-[#FFF4E0]',
  },
  signed: {
    label: 'Assinado',
    icon: CheckCircle2,
    color: 'text-[#22C55E] bg-[#E7F9EF]',
  },
  rejected: {
    label: 'Rejeitado',
    icon: XCircle,
    color: 'text-[#EF4444] bg-[#FEECEC]',
  },
  expired: {
    label: 'Expirado',
    icon: AlertCircle,
    color: 'text-gray-500 bg-[#F3F5F7]',
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
      className="block bg-white/95 border border-[#E0EDFF] rounded-3xl p-6 shadow-[0_20px_60px_rgba(10,132,255,0.08)] hover:shadow-[0_25px_70px_rgba(10,132,255,0.12)] transition-all duration-200 hover:-translate-y-1 animate-fade-in backdrop-blur-xl"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-[#0A192F] truncate mb-1">
            {document.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">
            {document.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span
          className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium ${statusStyle.color}`}
        >
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/80 text-current">
            <StatusIcon className="w-3 h-3" />
          </span>
          <span>{statusStyle.label}</span>
        </span>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <User className="w-4 h-4 text-[#0A84FF]" />
          <span>
            {signedCount}/{totalSignatures}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-[#EAF2FF]">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-[#0A84FF]" />
          <span>Criado em {formatDate(document.createdAt)}</span>
        </div>
        {document.expiresAt && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#0A84FF]" />
            <span>Expira em {formatDate(document.expiresAt)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
