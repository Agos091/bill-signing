import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Mail, Lock, LogIn, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f7f9ff,_#e9efff,_#f6f7fb)] dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-black px-4">
      <div className="max-w-6xl mx-auto py-16 flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 dark:bg-white/5 text-sm font-medium text-slate-600 dark:text-white/70">
            <FileText className="w-4 h-4 mr-2" />
            Bill Signing
          </div>
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-white leading-tight">
            Entre em um fluxo de assinaturas tão fluido quanto um app da Apple.
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-300">
            Continue exatamente de onde parou, com transições suaves, vidro esfumado e tipografia elegante.
          </p>
        </div>

        <div className="glass-panel rounded-[28px] p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-8 text-center">
            Entrar na conta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-white/60 dark:border-white/10 focus:ring-2 focus:ring-primary-500/70"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-white/60 dark:border-white/10 focus:ring-2 focus:ring-primary-500/70"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-lg shadow-primary-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
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

          <div className="mt-6 text-center text-slate-500 dark:text-slate-300">
            Não tem uma conta?{' '}
            <Link to="/signup" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Criar conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

