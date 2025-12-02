import { FileText, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DocumentCard } from '../components/DocumentCard';

export function Home() {
  const { documents } = useApp();

  const stats = {
    total: documents.length,
    pending: documents.filter((d) => d.status === 'pending').length,
    signed: documents.filter((d) => d.status === 'signed').length,
    rejected: documents.filter((d) => d.status === 'rejected').length,
  };

  const recentDocuments = documents.slice(0, 4);

  return (
    <div className="space-y-10 animate-fade-in bg-gradient-to-br from-[#F5F9FF] via-white to-white rounded-[32px] border border-[#E0EDFF] shadow-[0_25px_70px_rgba(10,132,255,0.08)] p-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <span className="uppercase text-xs tracking-[0.4em] text-blue-500">Visão geral</span>
          <h1 className="text-4xl font-semibold text-[#0A192F] leading-tight">
            Seus documentos, fluxos e assinaturas organizados com IA.
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Acompanhe o status de cada contrato, receba recomendações inteligentes e mantenha a governança documental com poucos cliques.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span className="px-3 py-1 rounded-full bg-white border border-[#EAF2FF]">⚡ Painel em tempo real</span>
            <span className="px-3 py-1 rounded-full bg-white border border-[#EAF2FF]">🤖 Insights automáticos</span>
            <span className="px-3 py-1 rounded-full bg-white border border-[#EAF2FF]">📂 Pastas inteligentes</span>
          </div>
        </div>
        <div className="w-full lg:w-80 bg-white border border-[#EAF2FF] rounded-3xl shadow-[0_20px_60px_rgba(10,132,255,0.12)] p-6 space-y-4">
          <p className="text-sm text-gray-400 uppercase tracking-[0.4em]">Resumo IA</p>
          <p className="text-4xl font-semibold text-[#0A84FF]">{stats.total || 0}</p>
          <p className="text-sm text-gray-500">Documentos monitorados hoje</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Pendentes</span>
              <span className="font-medium text-[#FFB020]">{stats.pending}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Aprovados</span>
              <span className="font-medium text-[#22C55E]">{stats.signed}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total',
            value: stats.total,
            icon: FileText,
            accent: 'from-[#0A84FF] to-[#4BC0FF]',
          },
          {
            label: 'Pendentes',
            value: stats.pending,
            icon: Clock,
            accent: 'from-[#FFD176] to-[#FFB020]',
          },
          {
            label: 'Assinados',
            value: stats.signed,
            icon: CheckCircle2,
            accent: 'from-[#34D399] to-[#10B981]',
          },
          {
            label: 'Rejeitados',
            value: stats.rejected,
            icon: XCircle,
            accent: 'from-[#FCA5A5] to-[#EF4444]',
          },
        ].map((card, index) => (
          <div key={index} className="bg-white rounded-3xl border border-[#EAF2FF] p-5 shadow-[0_15px_40px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-4xl font-semibold text-[#0A192F] mt-2">{card.value}</p>
              </div>
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${card.accent} text-white`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-blue-500">Timeline</p>
            <h2 className="text-2xl font-semibold text-[#0A192F]">
              Documentos recentes
            </h2>
          </div>
          <Link
            to="/documents"
            className="text-[#0A84FF] hover:text-[#006EDC] font-medium text-sm"
          >
            Ver todos →
          </Link>
        </div>

        {recentDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentDocuments.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E0EDFF] p-12 text-center shadow-[0_20px_60px_rgba(10,132,255,0.08)]">
            <FileText className="w-16 h-16 text-[#0A84FF] mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              Nenhum documento ainda
            </p>
            <Link
              to="/create"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#0A84FF] to-[#4BC0FF] text-white rounded-full font-semibold transition"
            >
              Criar primeiro documento
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
