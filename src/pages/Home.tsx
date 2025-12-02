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
    <div className="space-y-10 animate-fade-in">
      <section className="rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 sm:p-8 text-white overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-20 top-0 w-72 h-72 bg-primary-500/40 blur-[120px]" />
          <div className="absolute left-10 bottom-0 w-60 h-60 bg-indigo-400/20 blur-[160px]" />
        </div>
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
          <div>
            <p className="uppercase tracking-[0.4em] text-xs text-white/60">Bem-vindo de volta</p>
            <h1 className="text-4xl font-semibold mt-3">Gerencie assinaturas com elegância.</h1>
            <p className="text-white/70 mt-4 max-w-2xl">
              Acompanhe cada documento com uma experiência visual refinada inspirada no ecossistema Apple.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/create" className="accent-pill shadow-primary-500/50">
                Criar documento
              </Link>
              <Link
                to="/documents"
                className="px-5 py-2 rounded-full border border-white/30 text-white/80 hover:bg-white/10 transition"
              >
                Ver todos os documentos
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 glass-panel rounded-3xl p-6 w-full lg:max-w-sm">
            {[
              { icon: FileText, label: 'Total', value: stats.total },
              { icon: Clock, label: 'Pendentes', value: stats.pending },
              { icon: CheckCircle2, label: 'Assinados', value: stats.signed },
              { icon: XCircle, label: 'Rejeitados', value: stats.rejected },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-white/70 dark:bg-white/5 p-4 text-slate-900 dark:text-white">
                <item.icon className="w-5 h-5 mb-3 text-slate-500 dark:text-white/70" />
                <p className="text-sm text-slate-500 dark:text-white/60">{item.label}</p>
                <p className="text-2xl font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Documentos recentes</h2>
            <p className="text-slate-500 dark:text-slate-400">Continue de onde parou</p>
          </div>
          <Link
            to="/documents"
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm"
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
          <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
            <FileText className="w-16 h-16 text-slate-300 mx-auto" />
            <p className="text-slate-500">Nenhum documento ainda</p>
            <Link to="/create" className="accent-pill justify-center">
              Criar primeiro documento
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
