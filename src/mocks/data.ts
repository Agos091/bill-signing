import { Document, User } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    avatar: '👤',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@example.com',
    avatar: '👩',
  },
  {
    id: '3',
    name: 'Pedro Costa',
    email: 'pedro@example.com',
    avatar: '👨',
  },
  {
    id: '4',
    name: 'Ana Oliveira',
    email: 'ana@example.com',
    avatar: '👩‍💼',
  },
];

const currentUser: User = mockUsers[0];

export const initialDocuments: Document[] = [
  {
    id: '1',
    title: 'Contrato de Prestação de Serviços - Q1 2025',
    description: 'Contrato de prestação de serviços para o primeiro trimestre de 2025 com a empresa TechCorp.',
    status: 'pending',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    expiresAt: '2025-02-15T23:59:59Z',
    createdBy: currentUser,
    signatures: [
      {
        id: 'sig1',
        userId: '2',
        userName: 'Maria Santos',
        userEmail: 'maria@example.com',
        status: 'pending',
      },
      {
        id: 'sig2',
        userId: '3',
        userName: 'Pedro Costa',
        userEmail: 'pedro@example.com',
        status: 'pending',
      },
    ],
  },
  {
    id: '2',
    title: 'Termo de Confidencialidade - Projeto Alpha',
    description: 'Acordo de confidencialidade relacionado ao Projeto Alpha, incluindo cláusulas de não divulgação.',
    status: 'signed',
    createdAt: '2025-01-10T14:30:00Z',
    updatedAt: '2025-01-12T16:45:00Z',
    createdBy: currentUser,
    signatures: [
      {
        id: 'sig3',
        userId: '2',
        userName: 'Maria Santos',
        userEmail: 'maria@example.com',
        status: 'signed',
        signedAt: '2025-01-11T09:15:00Z',
      },
      {
        id: 'sig4',
        userId: '3',
        userName: 'Pedro Costa',
        userEmail: 'pedro@example.com',
        status: 'signed',
        signedAt: '2025-01-12T16:45:00Z',
      },
    ],
  },
  {
    id: '3',
    title: 'Ajuste Contratual - Fornecedor Beta',
    description: 'Ajuste nas condições comerciais com o fornecedor Beta, incluindo novos prazos e valores.',
    status: 'pending',
    createdAt: '2025-01-20T08:00:00Z',
    updatedAt: '2025-01-20T08:00:00Z',
    expiresAt: '2025-02-20T23:59:59Z',
    createdBy: currentUser,
    signatures: [
      {
        id: 'sig5',
        userId: '4',
        userName: 'Ana Oliveira',
        userEmail: 'ana@example.com',
        status: 'pending',
      },
    ],
  },
  {
    id: '4',
    title: 'Aditivo ao Contrato de Locação',
    description: 'Aditivo ao contrato de locação do escritório principal, prorrogando o prazo por mais 12 meses.',
    status: 'rejected',
    createdAt: '2025-01-05T11:20:00Z',
    updatedAt: '2025-01-08T15:30:00Z',
    createdBy: currentUser,
    signatures: [
      {
        id: 'sig6',
        userId: '2',
        userName: 'Maria Santos',
        userEmail: 'maria@example.com',
        status: 'rejected',
        signedAt: '2025-01-08T15:30:00Z',
        comment: 'Necessário revisar cláusulas financeiras',
      },
    ],
  },
  {
    id: '5',
    title: 'Acordo de Parceria Estratégica',
    description: 'Acordo de parceria estratégica entre as empresas para desenvolvimento conjunto de produtos.',
    status: 'signed',
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2025-01-03T14:20:00Z',
    createdBy: currentUser,
    signatures: [
      {
        id: 'sig7',
        userId: '2',
        userName: 'Maria Santos',
        userEmail: 'maria@example.com',
        status: 'signed',
        signedAt: '2025-01-02T10:30:00Z',
      },
      {
        id: 'sig8',
        userId: '3',
        userName: 'Pedro Costa',
        userEmail: 'pedro@example.com',
        status: 'signed',
        signedAt: '2025-01-03T14:20:00Z',
      },
      {
        id: 'sig9',
        userId: '4',
        userName: 'Ana Oliveira',
        userEmail: 'ana@example.com',
        status: 'signed',
        signedAt: '2025-01-03T14:20:00Z',
      },
    ],
  },
];

export { currentUser };
