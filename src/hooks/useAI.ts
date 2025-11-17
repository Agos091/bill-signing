import { useState, useCallback } from 'react';
import { apiClient } from '../config/api';

export interface LLMAnalysisResult {
  summary: string;
  keyPoints: string[];
  riskLevel: 'low' | 'medium' | 'high';
  suggestions: string[];
  estimatedReadingTime?: number;
}

export interface ComplianceResult {
  compliant: boolean;
  issues: string[];
}

export function useAI() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [isCheckingCompliance, setIsCheckingCompliance] = useState(false);

  const analyzeDocument = useCallback(async (documentId: string): Promise<LLMAnalysisResult> => {
    setIsAnalyzing(true);
    try {
      const result = await apiClient.post<LLMAnalysisResult>(`/documents/${documentId}/analyze`);
      return result;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const generateSummary = useCallback(async (documentId: string): Promise<string> => {
    setIsGeneratingSummary(true);
    try {
      const result = await apiClient.post<{ summary: string }>(`/documents/${documentId}/summary`);
      return result.summary;
    } finally {
      setIsGeneratingSummary(false);
    }
  }, []);

  const generateSuggestions = useCallback(async (documentId: string): Promise<string[]> => {
    setIsGeneratingSuggestions(true);
    try {
      const result = await apiClient.post<{ suggestions: string[] }>(
        `/documents/${documentId}/suggestions`
      );
      return result.suggestions;
    } finally {
      setIsGeneratingSuggestions(false);
    }
  }, []);

  const checkCompliance = useCallback(
    async (documentId: string, rules?: string[]): Promise<ComplianceResult> => {
      setIsCheckingCompliance(true);
      try {
        const result = await apiClient.post<ComplianceResult>(
          `/documents/${documentId}/compliance`,
          { rules }
        );
        return result;
      } finally {
        setIsCheckingCompliance(false);
      }
    },
    []
  );

  return {
    analyzeDocument,
    generateSummary,
    generateSuggestions,
    checkCompliance,
    isAnalyzing,
    isGeneratingSummary,
    isGeneratingSuggestions,
    isCheckingCompliance,
  };
}

