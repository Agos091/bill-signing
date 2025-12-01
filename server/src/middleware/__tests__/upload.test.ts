import multer from 'multer';
import { upload } from '../upload.js';

describe('Upload Middleware', () => {
  it('should be configured with multer', () => {
    expect(upload).toBeDefined();
    expect(upload.single).toBeDefined();
    expect(typeof upload.single).toBe('function');
  });

  it('should accept single file upload', () => {
    const singleUpload = upload.single('file');
    expect(singleUpload).toBeDefined();
  });
});

