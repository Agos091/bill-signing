import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Configuração do multer para armazenamento em memória
const storage = multer.memoryStorage();

// Filtro de tipos de arquivo permitidos
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = [
    'application/pdf',
    'text/csv',
    'text/plain',
    'text/markdown',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/msword', // DOC
    'application/vnd.ms-excel', // XLS
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
  ];

  const allowedExtensions = ['.pdf', '.csv', '.txt', '.md', '.doc', '.docx', '.xls', '.xlsx'];

  const ext = path.extname(file.originalname).toLowerCase();
  const isValidMime = allowedMimes.includes(file.mimetype);
  const isValidExt = allowedExtensions.includes(ext);

  if (isValidMime || isValidExt) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de arquivo não permitido. Tipos aceitos: ${allowedExtensions.join(', ')}`));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});


