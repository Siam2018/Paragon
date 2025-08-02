import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use req.uploadSubfolder to determine subfolder, default to 'uploads'
    const subfolder = req.uploadSubfolder || 'uploads';
    const uploadPath = `uploads/${subfolder.toLowerCase()}`;
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Add timestamp to prevent filename conflicts
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension);
    cb(null, `${baseName}_${timestamp}${extension}`);
  }
});

const dynamicUpload = (subfolder) => {
  return (req, res, next) => {
    req.uploadSubfolder = subfolder;
    
    // Determine file field name and filter based on subfolder
    let fieldName = 'Image'; // default field name for image uploads
    let fileFilter = (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    };
    
    // For gallery subfolder, use 'image' (lowercase) field name
    if (subfolder.toLowerCase() === 'gallery') {
      fieldName = 'image';
    }
    
    // For Notice/notices subfolder, accept PDF files with 'PDF' field name
    if (subfolder.toLowerCase() === 'notice' || subfolder.toLowerCase() === 'notices') {
      fieldName = 'PDF';
      fileFilter = (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
          cb(null, true);
        } else {
          cb(new Error('Only PDF files are allowed!'), false);
        }
      };
    }
    
    multer({ 
      storage,
      fileFilter,
      limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
      }
    }).single(fieldName)(req, res, (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  };
};

export default dynamicUpload;
