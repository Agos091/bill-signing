import { useState } from 'react';
import { Sparkles, FileText, Lightbulb, Shield, Brain, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { AIAnalysis } from '../components/AIAnalysis';

export function AIAssistant() {
  const { documents } = useApp();
  const navigate = useNavigate();
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  const pendingDocuments = documents.filter((doc) => doc.status === 'pending');
  const recentDocuments = documents.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
          <Sparkles className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Assistente de IA
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Análise inteligente, resumos e sugestões para seus documentos
          </p>
        </div>
      </div>

      {/* Cards de funcionalidades */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Análise Inteligente
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Extraia insights, pontos-chave e avalie o nível de risco dos seus documentos
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Lightbulb className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sugestões
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Receba recomendações inteligentes para melhorar seus documentos
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Conformidade
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Verifique a conformidade legal e regulatória dos seus documentos
          </p>
        </div>
      </div>

      {/* Seleção de documento */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Selecione um documento para análise
        </h2>

        {selectedDocumentId ? (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedDocumentId(null)}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              ← Voltar para seleção
            </button>
            <AIAnalysis documentId={selectedDocumentId} />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Documentos pendentes */}
            {pendingDocuments.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                  Documentos Pendentes ({pendingDocuments.length})
                </h3>
                <div className="space-y-2">
                  {pendingDocuments.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDocumentId(doc.id)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {doc.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {doc.description.substring(0, 60)}...
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Documentos recentes */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                Documentos Recentes
              </h3>
              <div className="space-y-2">
                {recentDocuments.length > 0 ? (
                  recentDocuments.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDocumentId(doc.id)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {doc.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {doc.description.substring(0, 60)}...
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhum documento disponível</p>
                    <button
                      onClick={() => navigate('/create')}
                      className="mt-4 text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      Criar primeiro documento
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Informações adicionais */}
      <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800 p-6">
        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-primary-900 dark:text-primary-200 mb-2">
              Como funciona
            </h3>
            <ul className="space-y-2 text-sm text-primary-800 dark:text-primary-300">
              <li>• Selecione um documento da lista acima</li>
              <li>• Use os botões de análise para obter insights inteligentes</li>
              <li>• Visualize resumos, sugestões e verificações de conformidade</li>
              <li>• Tome decisões mais informadas sobre seus documentos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

