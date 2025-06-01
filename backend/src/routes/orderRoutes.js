import express from 'express';
import { createOrder, getOrders } from '../controllers/orderController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected route to create a new order
router.post('/orders', authenticate, createOrder);

// Protected route to get orders for the authenticated user
router.get('/orders', authenticate, getOrders);

export default router; 