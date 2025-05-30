import express from 'express';
import { createProduct } from '../controllers/productController.js';
import { authenticate } from '../middleware/authMiddleware.js'; // Assuming you have an auth middleware
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Files will be stored in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    // Create a unique filename
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

// Protected route to create a new product with file upload
// Use upload.array('images', 10) for multiple files (up to 10)
// Use upload.single('image') for a single file
router.post('/products', authenticate, upload.array('images', 10), createProduct);

export default router; 