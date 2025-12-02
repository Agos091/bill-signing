import { FileText } from 'lucide-react';
import { UserMenu } from './UserMenu';

export function Header() {
  return (
    <header className="relative bg-gradient-to-r from-[#EAF2FF] via-white to-white border-b border-[#E0EDFF] shadow-[0_10px_40px_rgba(10,132,255,0.08)] backdrop-blur-2xl sticky top-0 z-40 overflow-hidden">
      <div className="absolute inset-0 opacity-50 pointer-events-none">
        <div className="w-40 h-40 bg-gradient-to-br from-white/70 to-[#EAF2FF] rounded-full blur-3xl absolute -top-10 -left-12" />
        <div className="w-48 h-48 bg-gradient-to-br from-white/70 to-[#E0EDFF]/80 rounded-full blur-3xl absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3" />
      </div>
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0A84FF] to-[#4BC0FF] text-white shadow-[0_10px_30px_rgba(10,132,255,0.35)] border border-white/40">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-[#0A192F]">Bill Signing</h1>
                <span className="text-xs uppercase tracking-[0.4em] text-blue-400">IA</span>
              </div>
              <p className="text-sm text-gray-500">
                Organização + inteligência em assinaturas digitais
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 text-sm text-gray-500">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-blue-500">Monitoramento</p>
                <p className="font-semibold text-[#0A192F]">Painel ao vivo</p>
              </div>
              <div className="h-10 w-px bg-[#E0EDFF]" />
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-blue-500">IA ativa</p>
                <p className="font-semibold text-[#0A192F]">Documentos analisados</p>
              </div>
            </div>

            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
