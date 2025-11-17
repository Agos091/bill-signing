import { useState } from 'react';
import {
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  FileText,
  Shield,
  Clock,
} from 'lucide-react';
import { useAI, type LLMAnalysisResult, type ComplianceResult } from '../hooks/useAI';
import toast from 'react-hot-toast';

interface AIAnalysisProps {
  documentId: string;
}

export function AIAnalysis({ documentId }: AIAnalysisProps) {
  const {
    analyzeDocument,
    generateSummary,
    generateSuggestions,
    checkCompliance,
    isAnalyzing,
    isGeneratingSummary,
    isGeneratingSuggestions,
    isCheckingCompliance,
  } = useAI();

  const [analysis, setAnalysis] = useState<LLMAnalysisResult | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const [compliance, setCompliance] = useState<ComplianceResult | null>(null);
  const [activeTab, setActiveTab] = useState<'analysis' | 'summary' | 'suggestions' | 'compliance'>('analysis');

  const handleAnalyze = async () => {
    try {
      const result = await analyzeDocument(documentId);
      setAnalysis(result);
      setActiveTab('analysis');
      toast.success('Análise concluída com sucesso!');
    } catch (error) {
      toast.error('Erro ao analisar documento');
      console.error(error);
    }
  };

  const handleGenerateSummary = async () => {
    try {
      const result = await generateSummary(documentId);
      setSummary(result);
      setActiveTab('summary');
      toast.success('Resumo gerado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar resumo');
      console.error(error);
    }
  };

  const handleGenerateSuggestions = async () => {
    try {
      const result = await generateSuggestions(documentId);
      setSuggestions(result);
      setActiveTab('suggestions');
      toast.success('Sugestões geradas com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar sugestões');
      console.error(error);
    }
  };

  const handleCheckCompliance = async () => {
    try {
      const result = await checkCompliance(documentId);
      setCompliance(result);
      setActiveTab('compliance');
      toast.success('Verificação de conformidade concluída!');
    } catch (error) {
      toast.error('Erro ao verificar conformidade');
      console.error(error);
    }
  };

  const riskLevelConfig = {
    low: { label: 'Baixo', color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20', icon: CheckCircle2 },
    medium: { label: 'Médio', color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20', icon: AlertCircle },
    high: { label: 'Alto', color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20', icon: XCircle },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <div className="flex items-center space-x-2 mb-6">
        <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Análise Inteligente com IA
        </h3>
      </div>

      {/* Botões de ação */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          <span>Analisar</span>
        </button>

        <button
          onClick={handleGenerateSummary}
          disabled={isGeneratingSummary}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeneratingSummary ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          <span>Resumo</span>
        </button>

        <button
          onClick={handleGenerateSuggestions}
          disabled={isGeneratingSuggestions}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeneratingSuggestions ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Lightbulb className="w-4 h-4" />
          )}
          <span>Sugestões</span>
        </button>

        <button
          onClick={handleCheckCompliance}
          disabled={isCheckingCompliance}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCheckingCompliance ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Shield className="w-4 h-4" />
          )}
          <span>Conformidade</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-4 border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'analysis' as const, label: 'Análise', visible: !!analysis },
          { id: 'summary' as const, label: 'Resumo', visible: !!summary },
          { id: 'suggestions' as const, label: 'Sugestões', visible: !!suggestions },
          { id: 'compliance' as const, label: 'Conformidade', visible: !!compliance },
        ]
          .filter((tab) => tab.visible)
          .map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
      </div>

      {/* Conteúdo das tabs */}
      <div className="min-h-[200px]">
        {activeTab === 'analysis' && analysis && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Resumo</h4>
              <p className="text-gray-600 dark:text-gray-400">{analysis.summary}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Pontos-Chave</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                {analysis.keyPoints.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-center space-x-4">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Nível de Risco:</span>
                {(() => {
                  const config = riskLevelConfig[analysis.riskLevel];
                  const Icon = config.icon;
                  return (
                    <span
                      className={`ml-2 inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{config.label}</span>
                    </span>
                  );
                })()}
              </div>
              {analysis.estimatedReadingTime && (
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>~{analysis.estimatedReadingTime} min de leitura</span>
                </div>
              )}
            </div>

            {analysis.suggestions.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>Sugestões</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                  {analysis.suggestions.map((suggestion, idx) => (
                    <li key={idx}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'summary' && summary && (
          <div className="animate-fade-in">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
              {summary}
            </p>
          </div>
        )}

        {activeTab === 'suggestions' && suggestions && (
          <div className="space-y-3 animate-fade-in">
            {suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
              >
                <Lightbulb className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 dark:text-gray-300">{suggestion}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'compliance' && compliance && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center space-x-3">
              {compliance.compliant ? (
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="font-semibold text-lg">Documento em Conformidade</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                  <XCircle className="w-6 h-6" />
                  <span className="font-semibold text-lg">Problemas de Conformidade Encontrados</span>
                </div>
              )}
            </div>

            {compliance.issues.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Problemas Identificados:</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                  {compliance.issues.map((issue, idx) => (
                    <li key={idx} className="flex items-start">
                      <AlertCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0 mt-1" />
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {compliance.compliant && compliance.issues.length === 0 && (
              <p className="text-gray-600 dark:text-gray-400">
                O documento está em conformidade com todas as regras verificadas.
              </p>
            )}
          </div>
        )}

        {!analysis && !summary && !suggestions && !compliance && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Sparkles className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Clique em um dos botões acima para começar a análise inteligente
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

