import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/user.js';
import mongoose from 'mongoose'; // Import mongoose

// Create a new order
export const createOrder = async (req, res) => {
    console.log('Received POST request to /api/orders');
    try {
        const userId = req.user.userId; // Get user ID from authenticated request
        const { items, totalAmount } = req.body;

        // Basic validation
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Giỏ hàng trống' });
        }
        if (totalAmount === undefined || totalAmount <= 0) {
             return res.status(400).json({ message: 'Tổng tiền không hợp lệ' });
        }

        let orderItems = [];
        let calculatedTotal = 0;

        // Validate items and update stock
        for (const item of items) {
            // Correctly access the product ID sent from frontend
            const productId = item.product;
            console.log('Processing item with product ID (corrected):', productId);
            const product = await Product.findById(productId);

            // Check if product exists and has enough stock
            if (!product) {
                // Revert stock changes for previous items if any
                for(const prevItem of orderItems) {
                    await Product.findByIdAndUpdate(prevItem.product, { $inc: { stockQuantity: prevItem.quantity } });
                }
                return res.status(404).json({ message: `Sản phẩm ${item.product.name || item.product._id} không tồn tại` });
            }

            if (product.stockQuantity < item.quantity) {
                 // Revert stock changes for previous items if any
                 for(const prevItem of orderItems) {
                     await Product.findByIdAndUpdate(prevItem.product, { $inc: { stockQuantity: prevItem.quantity } });
                 }
                return res.status(400).json({ message: `Không đủ số lượng cho sản phẩm ${product.name}` });
            }

            // Decrease stock quantity
            product.stockQuantity -= item.quantity;
            await product.save();

            // Add item to order items
            orderItems.push({
                // Create ObjectId from the string ID
                product: new mongoose.Types.ObjectId(productId), 
                quantity: item.quantity,
                price: product.price // Use current product price for order item
            });
            calculatedTotal += product.price * item.quantity;
        }

        // Optional: Check if calculated total matches the totalAmount sent from frontend
        // This can help prevent tampering, but might need tolerance for floating point issues.
        // For simplicity, we'll trust the frontend totalAmount for now or recalculate on backend.

        // Create new order
        const newOrder = new Order({
            user: userId,
            items: orderItems,
            totalAmount: calculatedTotal, // Use calculated total for accuracy
            // You might want to get shipping address from user profile or request body
            // shippingAddress: req.body.shippingAddress || user.address,
            status: 'Pending' // Default status
        });

        await newOrder.save();

        res.status(201).json({ message: 'Đặt hàng thành công', order: newOrder });

    } catch (error) {
        console.error('Error creating order:', error);
        // Consider reverting stock changes in case of other errors (e.g., database save failure)
        // This might require more sophisticated transaction handling depending on complexity.
        res.status(500).json({ message: 'Lỗi khi đặt hàng', error: error.message });
    }
};

// Get orders for a user
export const getOrders = async (req, res) => {
    try {
        const userId = req.user.userId; // Get user ID from authenticated request

        // Find orders for the user and populate product details
        const orders = await Order.find({ user: userId })
                                  .populate('items.product', 'name price images') // Populate product details (name, price, images)
                                  .sort({ createdAt: -1 }); // Sort by creation date, newest first

        res.json(orders); // Return the list of orders

    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn hàng', error: error.message });
    }
}; 