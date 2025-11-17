export type DocumentStatus = 'pending' | 'signed' | 'rejected' | 'expired';

export type SignatureStatus = 'pending' | 'signed' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Signature {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: SignatureStatus;
  signedAt?: string;
  comment?: string;
}

export interface Document {
  id: string;
  title: string;
  description: string;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  createdBy: User;
  signatures: Signature[];
  fileUrl?: string;
}

export interface CreateDocumentData {
  title: string;
  description: string;
  signatures: Array<{
    userEmail: string;
    userName: string;
  }>;
  expiresAt?: string;
}

export interface LLMAnalysisResult {
  summary: string;
  keyPoints: string[];
  riskLevel: 'low' | 'medium' | 'high';
  suggestions: string[];
  estimatedReadingTime?: number;
}

export interface LLMProvider {
  analyzeDocument(content: string): Promise<LLMAnalysisResult>;
  generateSummary(content: string): Promise<string>;
  suggestImprovements(content: string): Promise<string[]>;
  checkCompliance(content: string, rules?: string[]): Promise<{ compliant: boolean; issues: string[] }>;
}

