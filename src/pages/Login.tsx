import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Loader2, Apple } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      await login(email, password);
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer login');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F5F5F7] text-gray-900 overflow-hidden">
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="w-64 h-64 bg-gradient-to-br from-gray-200 to-white rounded-full blur-3xl absolute -top-10 -right-10" />
        <div className="w-72 h-72 bg-gradient-to-br from-gray-300 to-white rounded-full blur-3xl absolute bottom-0 -left-16" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-12 py-16 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left space-y-6">
          <span className="uppercase tracking-[0.4em] text-xs text-gray-500">Bill Signing</span>
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight text-gray-900">
            Assinaturas digitais com a delicadeza do ecossistema Apple.
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
            Uma experiência minimalista, elegante e segura para gerenciar contratos, aprovações e fluxos de assinatura.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-500">
            <span>🔐 Segurança de nível empresarial</span>
            <span>✨ Interface refinada</span>
            <span>🤝 Colaboração inteligente</span>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-2xl border border-white/50 rounded-[32px] shadow-[0_20px_80px_rgba(15,23,42,0.12)] p-8 space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold">Entrar na sua conta</h2>
              <p className="text-sm text-gray-500">Use seu e-mail corporativo para continuar</p>
            </div>

            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-3 px-4 py-3 rounded-full bg-black text-white font-semibold tracking-tight hover:bg-gray-900 transition"
            >
              <Apple className="w-5 h-5" />
              Entrar com Apple ID
            </button>

            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gray-400">
              <span className="h-px flex-1 bg-gray-200" />
              <span>ou</span>
              <span className="h-px flex-1 bg-gray-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:border-black focus:ring-2 focus:ring-black/10 transition"
                    placeholder="nome@empresa.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:border-black focus:ring-2 focus:ring-black/10 transition"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-black text-white rounded-full font-semibold tracking-tight hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Entrar</span>
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500">
              Não tem uma conta?{' '}
              <Link to="/signup" className="text-gray-900 font-semibold hover:underline">
                Criar conta
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            © {new Date().getFullYear()} Bill Signing. Design inspirado no ecossistema Apple.
          </p>
        </div>
      </div>
    </div>
  );
}

