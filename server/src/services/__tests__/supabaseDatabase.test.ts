import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  signDocument,
} from '../supabaseDatabase';
import { supabaseAdmin } from '../../config/supabase';

// Mock do supabaseAdmin
jest.mock('../../config/supabase', () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}));

describe('SupabaseDatabase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: '1', name: 'User 1', email: 'user1@test.com', avatar: '👤' },
        { id: '2', name: 'User 2', email: 'user2@test.com', avatar: '👤' },
      ];

      const selectChain = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: mockUsers,
          error: null,
        }),
      };

      (supabaseAdmin.from as jest.Mock).mockReturnValue(selectChain);

      const result = await getAllUsers();

      expect(result).toHaveLength(2);
      expect(result[0].email).toBe('user1@test.com');
      expect(supabaseAdmin.from).toHaveBeenCalledWith('profiles');
    });

    it('should return empty array when table does not exist', async () => {
      const selectChain = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116', message: 'relation does not exist' },
        }),
      };

      (supabaseAdmin.from as jest.Mock).mockReturnValue(selectChain);

      const result = await getAllUsers();

      expect(result).toEqual([]);
    });

    it('should throw error on other errors', async () => {
      const selectChain = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      };

      (supabaseAdmin.from as jest.Mock).mockReturnValue(selectChain);

      await expect(getAllUsers()).rejects.toThrow('Erro ao buscar usuários: Database error');
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const mockUser = { id: '1', name: 'User 1', email: 'user1@test.com', avatar: '👤' };

      const selectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockUser,
          error: null,
        }),
      };

      (supabaseAdmin.from as jest.Mock).mockReturnValue(selectChain);

      const result = await getUserById('1');

      expect(result).not.toBeNull();
      expect(result?.email).toBe('user1@test.com');
    });

    it('should return null when user not found', async () => {
      const selectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' },
        }),
      };

      (supabaseAdmin.from as jest.Mock).mockReturnValue(selectChain);

      const result = await getUserById('999');

      expect(result).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by email', async () => {
      const mockUser = { id: '1', name: 'User 1', email: 'user1@test.com', avatar: '👤' };

      const selectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockUser,
          error: null,
        }),
      };

      (supabaseAdmin.from as jest.Mock).mockReturnValue(selectChain);

      const result = await getUserByEmail('user1@test.com');

      expect(result).not.toBeNull();
      expect(result?.email).toBe('user1@test.com');
    });
  });

  describe('getAllDocuments', () => {
    it('should return all documents', async () => {
      const mockDocs = [
        {
          id: '1',
          title: 'Doc 1',
          description: 'Description 1',
          status: 'pending',
          created_by_profile: { id: '1', name: 'User', email: 'user@test.com' },
          signatures: [],
        },
      ];

      const selectChain = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: mockDocs,
          error: null,
        }),
      };

      (supabaseAdmin.from as jest.Mock).mockReturnValue(selectChain);

      const result = await getAllDocuments();

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Doc 1');
    });

    it('should return empty array when table does not exist', async () => {
      const selectChain = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116', message: 'relation does not exist' },
        }),
      };

      (supabaseAdmin.from as jest.Mock).mockReturnValue(selectChain);

      const result = await getAllDocuments();

      expect(result).toEqual([]);
    });
  });

  describe('getDocumentById', () => {
    it('should return document by id', async () => {
      const mockDoc = {
        id: '1',
        title: 'Doc 1',
        description: 'Description 1',
        status: 'pending',
        created_by_profile: { id: '1', name: 'User', email: 'user@test.com' },
        signatures: [],
      };

      const selectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockDoc,
          error: null,
        }),
      };

      (supabaseAdmin.from as jest.Mock).mockReturnValue(selectChain);

      const result = await getDocumentById('1');

      expect(result).not.toBeNull();
      expect(result?.title).toBe('Doc 1');
    });

    it('should return null when document not found', async () => {
      const selectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' },
        }),
      };

      (supabaseAdmin.from as jest.Mock).mockReturnValue(selectChain);

      const result = await getDocumentById('999');

      expect(result).toBeNull();
    });
  });

  describe('createDocument', () => {
    it('should create document successfully', async () => {
      const mockDoc = {
        id: '1',
        title: 'New Doc',
        description: 'Description',
        status: 'pending',
        created_by: 'user-1',
      };

      const mockCreatedDoc = {
        id: '1',
        title: 'New Doc',
        description: 'Description',
        status: 'pending',
        created_by_profile: { id: 'user-1', name: 'User', email: 'user@test.com' },
        signatures: [],
      };

      const insertChain = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockDoc,
          error: null,
        }),
      };

      const selectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockCreatedDoc,
          error: null,
        }),
      };

      const signaturesInsertChain = {
        insert: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      };

      (supabaseAdmin.from as jest.Mock).mockImplementation((table) => {
        if (table === 'documents') {
          return insertChain;
        }
        if (table === 'signatures') {
          return signaturesInsertChain;
        }
        return selectChain;
      });

      const document = {
        title: 'New Doc',
        description: 'Description',
        status: 'pending' as const,
        signatures: [
          { userName: 'User', userEmail: 'user@test.com' },
        ],
      };

      const result = await createDocument(document, 'user-1');

      expect(result).not.toBeNull();
      expect(result.title).toBe('New Doc');
    });

    it('should throw error when document creation fails', async () => {
      const insertChain = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Creation failed' },
        }),
      };

      (supabaseAdmin.from as jest.Mock).mockReturnValue(insertChain);

      const document = {
        title: 'New Doc',
        description: 'Description',
        status: 'pending' as const,
      };

      await expect(createDocument(document, 'user-1')).rejects.toThrow('Erro ao criar documento');
    });
  });

  describe('updateDocument', () => {
    it('should update document successfully', async () => {
      const mockUpdatedDoc = {
        id: '1',
        title: 'Updated Doc',
        description: 'Updated Description',
        status: 'pending',
        created_by_profile: { id: 'user-1', name: 'User', email: 'user@test.com' },
        signatures: [],
      };

      const updateChain = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      };

      const selectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockUpdatedDoc,
          error: null,
        }),
      };

      (supabaseAdmin.from as jest.Mock).mockImplementation((table) => {
        if (table === 'documents') {
          return updateChain;
        }
        return selectChain;
      });

      const result = await updateDocument('1', { title: 'Updated Doc' });

      expect(result).not.toBeNull();
      expect(result?.title).toBe('Updated Doc');
    });
  });

  describe('deleteDocument', () => {
    it('should delete document successfully', async () => {
      const deleteChain = {
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      };

      (supabaseAdmin.from as jest.Mock).mockReturnValue(deleteChain);

      const result = await deleteDocument('1');

      expect(result).toBe(true);
    });

    it('should return false when deletion fails', async () => {
      const deleteChain = {
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Deletion failed' },
        }),
      };

      (supabaseAdmin.from as jest.Mock).mockReturnValue(deleteChain);

      const result = await deleteDocument('1');

      expect(result).toBe(false);
    });
  });

  describe('signDocument', () => {
    it('should sign document successfully', async () => {
      const mockSignedDoc = {
        id: '1',
        title: 'Doc 1',
        description: 'Description',
        status: 'signed',
        created_by_profile: { id: 'user-1', name: 'User', email: 'user@test.com' },
        signatures: [{ id: 'sig-1', status: 'signed' }],
      };

      const updateChain = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
      };

      const selectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockSignedDoc,
          error: null,
        }),
      };

      const signaturesSelectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: [{ status: 'signed' }],
          error: null,
        }),
      };

      const documentsUpdateChain = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      };

      (supabaseAdmin.from as jest.Mock).mockImplementation((table) => {
        if (table === 'signatures') {
          if (updateChain.update.mock.calls.length === 0) {
            return updateChain;
          }
          return signaturesSelectChain;
        }
        if (table === 'documents') {
          if (selectChain.select.mock.calls.length === 0) {
            return documentsUpdateChain;
          }
          return selectChain;
        }
        return selectChain;
      });

      const result = await signDocument('1', 'sig-1', 'Signed!');

      expect(result).not.toBeNull();
    });
  });
});

