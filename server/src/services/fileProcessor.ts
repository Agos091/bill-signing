import fs from 'fs/promises';
import path from 'path';
import pdfParse from 'pdf-parse';
import { parse } from 'csv-parse/sync';

export interface ProcessedFile {
  content: string;
  metadata: {
    filename: string;
    mimeType: string;
    size: number;
    pages?: number; // Para PDFs
    rows?: number; // Para CSVs
  };
}

export class FileProcessor {
  private uploadsDir: string;

  constructor() {
    this.uploadsDir = path.join(process.cwd(), 'uploads');
    this.ensureUploadsDir();
  }

  private async ensureUploadsDir() {
    try {
      await fs.access(this.uploadsDir);
    } catch {
      await fs.mkdir(this.uploadsDir, { recursive: true });
    }
  }

  async processFile(filePath: string, originalName: string, mimeType: string): Promise<ProcessedFile> {
    const stats = await fs.stat(filePath);
    const size = stats.size;

    let content = '';
    let metadata: ProcessedFile['metadata'] = {
      filename: originalName,
      mimeType,
      size,
    };

    try {
      if (mimeType === 'application/pdf') {
        const data = await fs.readFile(filePath);
        const pdfData = await pdfParse(data);
        content = pdfData.text;
        metadata.pages = pdfData.numpages;
      } else if (mimeType === 'text/csv' || originalName.endsWith('.csv')) {
        const data = await fs.readFile(filePath, 'utf-8');
        const records = parse(data, {
          columns: true,
          skip_empty_lines: true,
        });
        metadata.rows = records.length;
        // Converte CSV para texto legível
        content = this.csvToText(records);
      } else if (mimeType.startsWith('text/')) {
        content = await fs.readFile(filePath, 'utf-8');
      } else if (
        mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        mimeType === 'application/msword'
      ) {
        // Para DOCX/DOC, retorna mensagem informativa
        content = `[Arquivo Word detectado: ${originalName}. Conteúdo não pode ser extraído automaticamente. Faça upload como PDF para melhor processamento.]`;
      } else {
        content = `[Tipo de arquivo: ${mimeType}. Conteúdo não pode ser extraído automaticamente.]`;
      }
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      content = `[Erro ao processar arquivo: ${error instanceof Error ? error.message : 'Erro desconhecido'}]`;
    }

    return {
      content,
      metadata,
    };
  }

  private csvToText(records: Record<string, string>[]): string {
    if (records.length === 0) return 'Arquivo CSV vazio';

    const headers = Object.keys(records[0]);
    let text = `CSV com ${records.length} linhas\n\n`;
    text += `Colunas: ${headers.join(', ')}\n\n`;

    // Limita a 100 primeiras linhas para não ficar muito grande
    const maxRows = Math.min(100, records.length);
    text += 'Dados:\n';
    for (let i = 0; i < maxRows; i++) {
      const row = records[i];
      const values = headers.map((h) => row[h] || '').join(' | ');
      text += `${i + 1}. ${values}\n`;
    }

    if (records.length > maxRows) {
      text += `\n... e mais ${records.length - maxRows} linhas`;
    }

    return text;
  }

  async saveFile(buffer: Buffer, filename: string): Promise<string> {
    await this.ensureUploadsDir();
    const filePath = path.join(this.uploadsDir, filename);
    await fs.writeFile(filePath, buffer);
    return filePath;
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
    }
  }

  getFileUrl(filename: string): string {
    return `/uploads/${filename}`;
  }
}

export const fileProcessor = new FileProcessor();


