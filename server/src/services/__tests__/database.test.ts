import { db } from '../database';
import type { Document, User } from '../../types';

describe('Database', () => {
  beforeEach(() => {
    // Reset database state before each test
    const allDocs = db.getAllDocuments();
    allDocs.forEach((doc) => db.deleteDocument(doc.id));
  });

  describe('getAllDocuments', () => {
    it('should return all documents', () => {
      const documents = db.getAllDocuments();
      expect(Array.isArray(documents)).toBe(true);
    });
  });

  describe('getDocumentById', () => {
    it('should return document by id', () => {
      const newDoc: Document = {
        id: 'test-1',
        title: 'Test Document',
        description: 'Test Description',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: db.getCurrentUser(),
        signatures: [],
      };
      db.createDocument(newDoc);
      const doc = db.getDocumentById('test-1');
      expect(doc).toBeDefined();
      expect(doc?.id).toBe('test-1');
    });

    it('should return undefined for non-existent document', () => {
      const doc = db.getDocumentById('non-existent');
      expect(doc).toBeUndefined();
    });
  });

  describe('createDocument', () => {
    it('should create a new document', () => {
      const newDoc: Document = {
        id: 'test-2',
        title: 'New Document',
        description: 'New Description',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: db.getCurrentUser(),
        signatures: [],
      };
      const created = db.createDocument(newDoc);
      expect(created.id).toBe('test-2');
      expect(db.getDocumentById('test-2')).toBeDefined();
    });
  });

  describe('updateDocument', () => {
    it('should update existing document', () => {
      const newDoc: Document = {
        id: 'test-3',
        title: 'Original Title',
        description: 'Original Description',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: db.getCurrentUser(),
        signatures: [],
      };
      db.createDocument(newDoc);
      const updated = db.updateDocument('test-3', { title: 'Updated Title' });
      expect(updated).toBeDefined();
      expect(updated?.title).toBe('Updated Title');
    });

    it('should return null for non-existent document', () => {
      const updated = db.updateDocument('non-existent', { title: 'New Title' });
      expect(updated).toBeNull();
    });
  });

  describe('deleteDocument', () => {
    it('should delete existing document', () => {
      const newDoc: Document = {
        id: 'test-4',
        title: 'To Delete',
        description: 'Will be deleted',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: db.getCurrentUser(),
        signatures: [],
      };
      db.createDocument(newDoc);
      const deleted = db.deleteDocument('test-4');
      expect(deleted).toBe(true);
      expect(db.getDocumentById('test-4')).toBeUndefined();
    });

    it('should return false for non-existent document', () => {
      const deleted = db.deleteDocument('non-existent');
      expect(deleted).toBe(false);
    });
  });

  describe('getUserById', () => {
    it('should return user by id', () => {
      const user = db.getUserById(db.getCurrentUser().id);
      expect(user).toBeDefined();
    });

    it('should return undefined for non-existent user', () => {
      const user = db.getUserById('non-existent');
      expect(user).toBeUndefined();
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by email', () => {
      const currentUser = db.getCurrentUser();
      const user = db.getUserByEmail(currentUser.email);
      expect(user).toBeDefined();
      expect(user?.email).toBe(currentUser.email);
    });

    it('should return undefined for non-existent email', () => {
      const user = db.getUserByEmail('non-existent@example.com');
      expect(user).toBeUndefined();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', () => {
      const users = db.getAllUsers();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user', () => {
      const user = db.getCurrentUser();
      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.name).toBeDefined();
    });
  });
});

