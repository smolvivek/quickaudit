const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueFilename);
  }
});

// Configure file filter
const fileFilter = (req, file, cb) => {
  // Accept images, PDFs, and common document formats
  const allowedFileTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, and office documents are allowed.'), false);
  }
};

// Configure upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  }
});

// Upload file
exports.uploadFile = async (req, res) => {
  try {
    // Use multer middleware for single file upload
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      // Get file info
      const { filename, originalname, mimetype, size } = req.file;
      const filePath = `/uploads/${filename}`;
      
      // In a real implementation, you would store file metadata in the database
      // and possibly upload to cloud storage like AWS S3
      
      res.status(200).json({
        message: 'File uploaded successfully',
        file: {
          filename,
          originalname,
          mimetype,
          size,
          path: filePath,
          url: `${req.protocol}://${req.get('host')}${filePath}`
        }
      });
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'Server error while uploading file' });
  }
};

// Get file by ID
exports.getFileById = async (req, res) => {
  try {
    const fileId = req.params.id;
    
    // In a real implementation, you would retrieve file metadata from the database
    // For now, we'll just check if the file exists in the uploads directory
    
    const uploadDir = path.join(__dirname, '../../uploads');
    const filePath = path.join(uploadDir, fileId);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Send file
    res.sendFile(filePath);
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ message: 'Server error while retrieving file' });
  }
};

// Delete file
exports.deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    
    // In a real implementation, you would check permissions and delete file metadata from the database
    
    const uploadDir = path.join(__dirname, '../../uploads');
    const filePath = path.join(uploadDir, fileId);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Delete file
    fs.unlinkSync(filePath);
    
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ message: 'Server error while deleting file' });
  }
};
