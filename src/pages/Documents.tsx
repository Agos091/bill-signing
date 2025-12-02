import { useState } from 'react';
import { Search, Plus, Calendar, Clock, User, CheckCircle2, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { DocumentStatus } from '../types';

const statusConfig = {
  pending: {
    label: 'Pendente',
    icon: Clock,
    color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  },
  signed: {
    label: 'Assinado',
    icon: CheckCircle2,
    color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  },
  rejected: {
    label: 'Rejeitado',
    icon: XCircle,
    color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  },
  expired: {
    label: 'Expirado',
    icon: AlertCircle,
    color: 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
  },
};

export function Documents() {
  const { documents, isLoading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<DocumentStatus | 'all'>('all');

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const stats = [
    { label: 'Total', value: documents.length },
    { label: 'Pendentes', value: documents.filter((doc) => doc.status === 'pending').length },
    { label: 'Assinados', value: documents.filter((doc) => doc.status === 'signed').length },
  ];

  const filterOptions: Array<{ value: DocumentStatus | 'all'; label: string }> = [
    { value: 'all', label: 'Todos' },
    { value: 'pending', label: 'Pendentes' },
    { value: 'signed', label: 'Assinados' },
    { value: 'rejected', label: 'Rejeitados' },
    { value: 'expired', label: 'Expirados' },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <section className="rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white p-6 sm:p-8 overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-10 w-72 h-72 bg-primary-500/40 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 blur-[120px]" />
        </div>
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <p className="uppercase tracking-[0.5em] text-xs text-white/60">Coleção</p>
            <h1 className="text-4xl font-semibold mt-3 mb-4">Seus documentos em um só lugar.</h1>
            <p className="text-white/70 text-lg max-w-2xl">
              Organize e acompanhe cada etapa das assinaturas com a mesma fluidez e refinamento de um aplicativo da Apple.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/create" className="accent-pill shadow-primary-500/50 hover:translate-y-0.5 transition-transform">
                <Plus className="w-4 h-4 mr-2" />
                Novo Documento
              </Link>
              <button className="px-5 py-2 rounded-full border border-white/20 text-white/80 hover:bg-white/10 transition">
                Explorar modelos
              </button>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-5 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por título ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-white/60 dark:border-white/10 focus:ring-2 focus:ring-primary-500/60"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => {
            const isActive = filterStatus === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setFilterStatus(option.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg'
                    : 'bg-white/70 dark:bg-white/5 text-slate-500 hover:bg-white'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </section>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredDocuments.length > 0 ? (
        <div className="glass-panel rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/70 dark:bg-white/5 border-b border-white/60 dark:border-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Assinaturas
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Criado em
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Expira em
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/70 dark:divide-white/5">
                {filteredDocuments.map((doc) => {
                  const StatusIcon = statusConfig[doc.status].icon;
                  const statusStyle = statusConfig[doc.status];
                  const signedCount = doc.signatures.filter((s) => s.status === 'signed').length;
                  const totalSignatures = doc.signatures.length;

                  return (
                    <tr key={doc.id} className="hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="max-w-md">
                          <Link
                            to={`/documents/${doc.id}`}
                            className="text-base font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors block mb-1"
                          >
                            {doc.title}
                          </Link>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {doc.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusStyle.color}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span>{statusStyle.label}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                            <User className="w-4 h-4" />
                            <span className="font-medium">
                              {signedCount}/{totalSignatures}
                            </span>
                          </div>
                          {totalSignatures > 0 && (
                            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-primary-600 h-2 rounded-full transition-all"
                                style={{ width: `${(signedCount / totalSignatures) * 100}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1.5 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(doc.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {doc.expiresAt ? (
                          <div className="flex items-center space-x-1.5 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(doc.expiresAt)}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/documents/${doc.id}`}
                          className="inline-flex items-center space-x-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                        >
                          <span>Ver</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
          <p className="text-slate-600 dark:text-slate-300">
            {searchTerm || filterStatus !== 'all'
              ? 'Nenhum documento encontrado com os filtros aplicados'
              : 'Nenhum documento ainda'}
          </p>
          {(!searchTerm && filterStatus === 'all') && (
            <Link
              to="/create"
              className="accent-pill inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Criar primeiro documento</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
