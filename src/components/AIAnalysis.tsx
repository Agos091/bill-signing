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
    low: { label: 'Baixo', color: 'text-[#22C55E] bg-[#E7F9EF]', icon: CheckCircle2 },
    medium: { label: 'Médio', color: 'text-[#FFB020] bg-[#FFF4E0]', icon: AlertCircle },
    high: { label: 'Alto', color: 'text-[#EF4444] bg-[#FEECEC]', icon: XCircle },
  };

  return (
    <div className="bg-white rounded-[32px] border border-[#E0EDFF] p-8 shadow-[0_25px_70px_rgba(10,132,255,0.08)] space-y-6">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0A84FF] to-[#4BC0FF] flex items-center justify-center text-white shadow-[0_15px_40px_rgba(10,132,255,0.25)]">
          <Sparkles className="w-6 h-6" />
        </span>
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-blue-500">IA aplicada</p>
          <h3 className="text-2xl font-semibold text-[#0A192F]">
            Análise inteligente
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#0A84FF] to-[#4BC0FF] text-white rounded-2xl font-medium shadow-[0_12px_40px_rgba(10,132,255,0.2)] transition disabled:opacity-50 disabled:cursor-not-allowed"
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
      <div className="flex flex-wrap gap-2 mb-4 border-b border-[#EAF2FF]">
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

      <div className="min-h-[200px]">
        {activeTab === 'analysis' && analysis && (
          <div className="space-y-4 animate-fade-in bg-[#F5F9FF] rounded-3xl border border-[#EAF2FF] p-6">
            <div>
              <h4 className="font-semibold text-[#0A192F] mb-2">Resumo</h4>
              <p className="text-gray-600">{analysis.summary}</p>
            </div>

            <div>
              <h4 className="font-semibold text-[#0A192F] mb-2">Pontos-Chave</h4>
              <ul className="space-y-2">
                {analysis.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex gap-2 text-gray-600">
                    <span className="w-1.5 h-1.5 mt-2 rounded-full bg-[#0A84FF]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div>
                <span className="text-sm text-gray-500">Nível de risco:</span>
                {(() => {
                  const config = riskLevelConfig[analysis.riskLevel];
                  const Icon = config.icon;
                  return (
                    <span
                      className={`ml-2 inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-medium ${config.color}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{config.label}</span>
                    </span>
                  );
                })()}
              </div>
              {analysis.estimatedReadingTime && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4 text-[#0A84FF]" />
                  <span>~{analysis.estimatedReadingTime} min de leitura</span>
                </div>
              )}
            </div>

            {analysis.suggestions.length > 0 && (
              <div>
                <h4 className="font-semibold text-[#0A192F] mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-[#0A84FF]" />
                  <span>Sugestões</span>
                </h4>
                <div className="grid gap-3 md:grid-cols-2">
                  {analysis.suggestions.map((suggestion, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-[#E0EDFF] bg-white">
                      <p className="text-sm text-gray-600">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'summary' && summary && (
          <div className="animate-fade-in bg-[#F5F9FF] rounded-3xl border border-[#EAF2FF] p-6 space-y-3">
            <h4 className="text-lg font-semibold text-[#0A192F]">Resumo completo</h4>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {summary}
            </p>
          </div>
        )}

        {activeTab === 'suggestions' && suggestions && (
          <div className="space-y-4 animate-fade-in">
            <h4 className="text-lg font-semibold text-[#0A192F]">Sugestões da IA</h4>
            <div className="grid gap-3 md:grid-cols-2">
              {suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 bg-[#F3F0FF] rounded-2xl border border-[#E2D9FF]"
                >
                  <Lightbulb className="w-5 h-5 text-[#7C3AED] mt-0.5" />
                  <p className="text-gray-700">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'compliance' && compliance && (
          <div className="space-y-4 animate-fade-in bg-[#F5F9FF] rounded-3xl border border-[#EAF2FF] p-6">
            <h4 className="text-lg font-semibold text-[#0A192F]">Conformidade</h4>
            <div className="flex flex-wrap items-center gap-3">
              {compliance.compliant ? (
                <span className="inline-flex items-center gap-2 text-[#22C55E] font-semibold text-lg">
                  <CheckCircle2 className="w-6 h-6" />
                  Documento em conformidade
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-[#EF4444] font-semibold text-lg">
                  <XCircle className="w-6 h-6" />
                  Problemas encontrados
                </span>
              )}
            </div>

            {compliance.issues.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-[#0A192F]">Problemas identificados:</h4>
                <div className="space-y-3">
                  {compliance.issues.map((issue, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl border border-[#FFE4E4] bg-white">
                      <AlertCircle className="w-4 h-4 text-[#EF4444] mt-1" />
                      <span className="text-gray-600">{issue}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {compliance.compliant && compliance.issues.length === 0 && (
              <p className="text-gray-600">
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

