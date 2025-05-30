import express from 'express';
import { createProduct, getProducts, updateProduct, deleteProduct } from '../controllers/productController.js';
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

// Protected route to get all products for the authenticated owner
router.get('/products', authenticate, getProducts);

// Protected route to update a product by ID (assuming no file upload in this update route)
router.put('/products/:id', authenticate, updateProduct);
// Or PATCH if you prefer partial updates: router.patch('/products/:id', authenticate, updateProduct);

// Protected route to delete a product by ID
router.delete('/products/:id', authenticate, deleteProduct);

export default router; 