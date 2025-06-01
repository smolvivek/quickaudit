const express = require('express');
const router = express.Router();
const fileController = require('../controllers/file.controller');

// Upload file
router.post(
  '/upload',
  fileController.uploadFile
);

// Get file by ID
router.get(
  '/:id',
  fileController.getFileById
);

// Delete file
router.delete(
  '/:id',
  fileController.deleteFile
);

module.exports = router;
