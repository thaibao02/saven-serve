import express from 'express';
import { createOrder, getOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected route to create a new order
router.post('/orders', authenticate, createOrder);

// Protected route to get orders for the authenticated user
router.get('/orders', authenticate, getOrders);

// Protected route to get all orders (for admin/owner)
router.get('/orders/all', authenticate, getAllOrders);

// Protected route to update order status (for admin/owner)
router.put('/orders/:id/status', authenticate, updateOrderStatus);

export default router; 