import { supabaseAdmin } from '../config/supabase.js';
import type { Document, User, Signature } from '../types/index.js';

// ============================================
// PROFILES / USERS
// ============================================

export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Erro ao buscar usuários:', error);
    throw new Error('Erro ao buscar usuários');
  }

  return data.map(mapProfileToUser);
}

export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Erro ao buscar usuário:', error);
    throw new Error('Erro ao buscar usuário');
  }

  return mapProfileToUser(data);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Erro ao buscar usuário por email:', error);
    throw new Error('Erro ao buscar usuário');
  }

  return mapProfileToUser(data);
}

// ============================================
// DOCUMENTS
// ============================================

export async function getAllDocuments(): Promise<Document[]> {
  const { data, error } = await supabaseAdmin
    .from('documents')
    .select(`
      *,
      created_by_profile:profiles!documents_created_by_fkey(*),
      signatures(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar documentos:', error);
    throw new Error('Erro ao buscar documentos');
  }

  return data.map(mapDocumentFromDB);
}

export async function getDocumentById(id: string): Promise<Document | null> {
  const { data, error } = await supabaseAdmin
    .from('documents')
    .select(`
      *,
      created_by_profile:profiles!documents_created_by_fkey(*),
      signatures(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Erro ao buscar documento:', error);
    throw new Error('Erro ao buscar documento');
  }

  return mapDocumentFromDB(data);
}

export async function createDocument(
  document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>,
  userId: string
): Promise<Document> {
  // Insere o documento
  const { data: docData, error: docError } = await supabaseAdmin
    .from('documents')
    .insert({
      title: document.title,
      description: document.description,
      status: document.status || 'pending',
      file_url: document.fileUrl,
      expires_at: document.expiresAt,
      created_by: userId,
    })
    .select()
    .single();

  if (docError) {
    console.error('Erro ao criar documento:', docError);
    throw new Error('Erro ao criar documento');
  }

  // Insere as assinaturas
  if (document.signatures && document.signatures.length > 0) {
    const signaturesData = document.signatures.map((sig) => ({
      document_id: docData.id,
      user_name: sig.userName,
      user_email: sig.userEmail,
      status: 'pending',
    }));

    const { error: sigError } = await supabaseAdmin
      .from('signatures')
      .insert(signaturesData);

    if (sigError) {
      console.error('Erro ao criar assinaturas:', sigError);
      // Deleta o documento se falhar ao criar assinaturas
      await supabaseAdmin.from('documents').delete().eq('id', docData.id);
      throw new Error('Erro ao criar assinaturas');
    }
  }

  // Retorna o documento completo
  const created = await getDocumentById(docData.id);
  if (!created) throw new Error('Erro ao recuperar documento criado');
  return created;
}

export async function updateDocument(
  id: string,
  updates: Partial<Document>
): Promise<Document | null> {
  const updateData: Record<string, unknown> = {};
  
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.fileUrl !== undefined) updateData.file_url = updates.fileUrl;
  if (updates.expiresAt !== undefined) updateData.expires_at = updates.expiresAt;

  const { error } = await supabaseAdmin
    .from('documents')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('Erro ao atualizar documento:', error);
    throw new Error('Erro ao atualizar documento');
  }

  return getDocumentById(id);
}

export async function deleteDocument(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('documents')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar documento:', error);
    return false;
  }

  return true;
}

// ============================================
// SIGNATURES
// ============================================

export async function signDocument(
  documentId: string,
  signatureId: string,
  comment?: string
): Promise<Document | null> {
  // Atualiza a assinatura
  const { error: sigError } = await supabaseAdmin
    .from('signatures')
    .update({
      status: 'signed',
      signed_at: new Date().toISOString(),
      comment,
    })
    .eq('id', signatureId)
    .eq('document_id', documentId);

  if (sigError) {
    console.error('Erro ao assinar:', sigError);
    throw new Error('Erro ao assinar documento');
  }

  // Verifica se todas as assinaturas foram concluídas
  const { data: signatures } = await supabaseAdmin
    .from('signatures')
    .select('status')
    .eq('document_id', documentId);

  const allSigned = signatures?.every((sig) => sig.status === 'signed');
  
  if (allSigned) {
    await supabaseAdmin
      .from('documents')
      .update({ status: 'signed' })
      .eq('id', documentId);
  }

  return getDocumentById(documentId);
}

// ============================================
// MAPPERS
// ============================================

function mapProfileToUser(profile: Record<string, unknown>): User {
  return {
    id: profile.id as string,
    name: profile.name as string,
    email: profile.email as string,
    avatar: (profile.avatar as string) || '👤',
  };
}

function mapDocumentFromDB(doc: Record<string, unknown>): Document {
  const createdByProfile = doc.created_by_profile as Record<string, unknown> | null;
  const signatures = (doc.signatures as Array<Record<string, unknown>>) || [];

  return {
    id: doc.id as string,
    title: doc.title as string,
    description: doc.description as string,
    status: doc.status as Document['status'],
    fileUrl: doc.file_url as string | undefined,
    expiresAt: doc.expires_at as string | undefined,
    createdAt: doc.created_at as string,
    updatedAt: doc.updated_at as string,
    createdBy: createdByProfile
      ? mapProfileToUser(createdByProfile)
      : { id: '', name: 'Usuário Removido', email: '', avatar: '👤' },
    signatures: signatures.map((sig) => ({
      id: sig.id as string,
      userId: (sig.user_id as string) || '',
      userName: sig.user_name as string,
      userEmail: sig.user_email as string,
      status: sig.status as Signature['status'],
      signedAt: sig.signed_at as string | undefined,
      comment: sig.comment as string | undefined,
    })),
  };
}

