import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename(_req, file, cb) {
    // Generate cryptographically safe random filename while preserving clean extension
    const randomName = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, '');
    cb(null, `report-${Date.now()}-${randomName}${ext}`);
  }
});

const checkFileType = (file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedExtensions = /pdf|jpg|jpeg|png|webp/;
  const allowedMimeTypes = /pdf|jpg|jpeg|png|webp/;

  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedMimeTypes.test(file.mimetype.toLowerCase());

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only PDF and image files (JPG, PNG, WEBP) are allowed.'));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (_req, file, cb) {
    checkFileType(file, cb);
  }
});