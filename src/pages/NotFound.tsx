import { AlertTriangle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
            <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-300" />
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
            NOT_FOUND
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            A página não foi encontrada
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
            Parece que o endereço acessado não existe ou foi movido. Verifique o link e tente novamente,
            ou retorne para a página inicial.
          </p>
        </div>

        <div className="text-gray-400 dark:text-gray-500 text-sm">
          gru1::2mbr7-1764638284663-b782e57e7a26
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-2 px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Voltar para o início</span>
          </button>
        </div>
      </div>
    </div>
  );
}

