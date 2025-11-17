import type { Document, User } from '../types/index.js';
import { initialDocuments, currentUser, mockUsers } from '../data/mockData.js';

// Simulação de banco de dados em memória
// Em produção, substituir por banco de dados real (PostgreSQL, MongoDB, etc.)
class Database {
  private documents: Map<string, Document> = new Map();
  private users: Map<string, User> = new Map();

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Inicializa com dados mock
    mockUsers.forEach((user) => {
      this.users.set(user.id, user);
    });

    initialDocuments.forEach((doc) => {
      this.documents.set(doc.id, doc);
    });
  }

  // Documents
  getAllDocuments(): Document[] {
    return Array.from(this.documents.values());
  }

  getDocumentById(id: string): Document | undefined {
    return this.documents.get(id);
  }

  createDocument(document: Document): Document {
    this.documents.set(document.id, document);
    return document;
  }

  updateDocument(id: string, updates: Partial<Document>): Document | null {
    const existing = this.documents.get(id);
    if (!existing) {
      return null;
    }

    const updated: Document = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.documents.set(id, updated);
    return updated;
  }

  deleteDocument(id: string): boolean {
    return this.documents.delete(id);
  }

  // Users
  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find((u) => u.email === email);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  getCurrentUser(): User {
    return currentUser;
  }
}

export const db = new Database();

