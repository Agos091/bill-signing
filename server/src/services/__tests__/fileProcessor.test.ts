import { fileProcessor } from '../fileProcessor.js';
import fs from 'fs/promises';
import path from 'path';

describe('FileProcessor', () => {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  let testFilePath: string;
  let testFileName: string;

  beforeEach(async () => {
    // Garante que o diretório existe
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
    } catch {
      // Ignora erros
    }
    testFileName = `test-${Date.now()}.txt`;
    testFilePath = path.join(uploadsDir, testFileName);
  });

  afterEach(async () => {
    // Limpa arquivos de teste
    try {
      await fs.unlink(testFilePath);
    } catch {
      // Ignora erros
    }
  });

  describe('saveFile', () => {
    it('should save a file', async () => {
      const buffer = Buffer.from('Test content');
      const savedPath = await fileProcessor.saveFile(buffer, testFileName);
      expect(savedPath).toBe(testFilePath);
      
      const exists = await fs.access(testFilePath).then(() => true).catch(() => false);
      expect(exists).toBe(true);
      
      // Verifica conteúdo
      const content = await fs.readFile(testFilePath, 'utf-8');
      expect(content).toBe('Test content');
    });

    it('should create uploads directory if it does not exist', async () => {
      // Remove diretório temporariamente (se existir)
      try {
        await fs.rmdir(uploadsDir, { recursive: true });
      } catch {
        // Ignora erro
      }
      
      const buffer = Buffer.from('Test');
      await fileProcessor.saveFile(buffer, testFileName);
      
      const exists = await fs.access(uploadsDir).then(() => true).catch(() => false);
      expect(exists).toBe(true);
    });
  });

  describe('getFileUrl', () => {
    it('should return correct file URL', () => {
      const url = fileProcessor.getFileUrl('test-file.pdf');
      expect(url).toBe('/uploads/test-file.pdf');
    });
  });

  describe('processFile', () => {
    it('should process a text file', async () => {
      const content = 'Test file content';
      await fs.writeFile(testFilePath, content);
      
      const result = await fileProcessor.processFile(testFilePath, 'test.txt', 'text/plain');
      expect(result.content).toBe(content);
      expect(result.metadata.filename).toBe('test.txt');
      expect(result.metadata.mimeType).toBe('text/plain');
      expect(result.metadata.size).toBeGreaterThan(0);
    });

    it('should handle CSV files', async () => {
      const csvContent = 'name,email\nJohn,john@example.com\nJane,jane@example.com';
      await fs.writeFile(testFilePath, csvContent);
      
      const result = await fileProcessor.processFile(testFilePath, 'test.csv', 'text/csv');
      expect(result.content).toContain('CSV');
      expect(result.metadata.rows).toBe(2);
    });

    it('should handle unsupported file types', async () => {
      await fs.writeFile(testFilePath, 'binary content');
      
      const result = await fileProcessor.processFile(
        testFilePath,
        'test.xyz',
        'application/unknown'
      );
      expect(result.content).toContain('Tipo de arquivo');
    });

    it('should handle Word documents', async () => {
      await fs.writeFile(testFilePath, 'docx content');
      
      const result = await fileProcessor.processFile(
        testFilePath,
        'test.docx',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
      expect(result.content).toContain('Arquivo Word');
    });

    it('should handle CSV with many rows', async () => {
      let csvContent = 'name,email\n';
      for (let i = 0; i < 150; i++) {
        csvContent += `User${i},user${i}@example.com\n`;
      }
      await fs.writeFile(testFilePath, csvContent);
      
      const result = await fileProcessor.processFile(testFilePath, 'test.csv', 'text/csv');
      expect(result.content).toContain('e mais');
      expect(result.metadata.rows).toBe(150);
    });

    it('should handle empty CSV', async () => {
      await fs.writeFile(testFilePath, '');
      
      const result = await fileProcessor.processFile(testFilePath, 'test.csv', 'text/csv');
      expect(result.content).toContain('vazio');
    });

    it('should handle CSV with exactly 100 rows', async () => {
      let csvContent = 'name,email\n';
      for (let i = 0; i < 100; i++) {
        csvContent += `User${i},user${i}@example.com\n`;
      }
      await fs.writeFile(testFilePath, csvContent);
      
      const result = await fileProcessor.processFile(testFilePath, 'test.csv', 'text/csv');
      expect(result.metadata.rows).toBe(100);
      expect(result.content).not.toContain('e mais'); // Não deve ter mensagem de "e mais"
    });

    it('should handle CSV with headers only', async () => {
      const csvContent = 'name,email\n';
      await fs.writeFile(testFilePath, csvContent);
      
      const result = await fileProcessor.processFile(testFilePath, 'test.csv', 'text/csv');
      expect(result.metadata.rows).toBe(0);
      expect(result.content).toContain('vazio');
    });

    it('should handle PDF files (even with invalid content)', async () => {
      // Cria um arquivo que será tratado como PDF mas com conteúdo inválido
      const pdfBuffer = Buffer.from('%PDF-1.4 fake pdf content');
      await fs.writeFile(testFilePath, pdfBuffer);
      
      // pdf-parse vai falhar com conteúdo inválido, mas o código deve capturar o erro
      const result = await fileProcessor.processFile(
        testFilePath,
        'test.pdf',
        'application/pdf'
      );
      expect(result.metadata.mimeType).toBe('application/pdf');
      expect(result.content).toBeDefined();
      // Deve ter mensagem de erro no conteúdo
      expect(result.content).toContain('Erro');
    });

    it('should handle markdown files', async () => {
      const mdContent = '# Markdown Title\n\nSome content';
      await fs.writeFile(testFilePath, mdContent);
      
      const result = await fileProcessor.processFile(
        testFilePath,
        'test.md',
        'text/markdown'
      );
      expect(result.content).toBe(mdContent);
    });

    it('should handle DOC files', async () => {
      await fs.writeFile(testFilePath, 'doc content');
      
      const result = await fileProcessor.processFile(
        testFilePath,
        'test.doc',
        'application/msword'
      );
      expect(result.content).toContain('Arquivo Word');
    });

    it('should handle DOCX files', async () => {
      await fs.writeFile(testFilePath, 'docx content');
      
      const result = await fileProcessor.processFile(
        testFilePath,
        'test.docx',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
      expect(result.content).toContain('Arquivo Word');
    });
  });

  describe('deleteFile', () => {
    it('should delete a file', async () => {
      await fs.writeFile(testFilePath, 'Test content');
      
      await fileProcessor.deleteFile(testFilePath);
      
      const exists = await fs.access(testFilePath).then(() => true).catch(() => false);
      expect(exists).toBe(false);
    });

    it('should not throw error when deleting non-existent file', async () => {
      await expect(
        fileProcessor.deleteFile(path.join(uploadsDir, 'non-existent.txt'))
      ).resolves.not.toThrow();
    });
  });
});

