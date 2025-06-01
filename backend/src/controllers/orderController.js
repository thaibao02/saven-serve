import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/user.js';
import mongoose from 'mongoose'; // Import mongoose
import { startOfDay, startOfWeek, startOfMonth, startOfYear, subMonths, subQuarters, subYears } from 'date-fns'; // Only import date calculation functions

const SHIPPING_FEE = 15000; // Define shipping fee

// Create a new order
export const createOrder = async (req, res) => {
    console.log('Received POST request to /api/orders');
    try {
        const userId = req.user.userId; // Get user ID from authenticated request
        const { items, totalAmount } = req.body; // totalAmount from frontend is not used for final calculation

        // Basic validation
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Giỏ hàng trống' });
        }
        // totalAmount validation removed as it's now calculated on backend

        let orderItems = [];
        let calculatedItemsTotal = 0; // Calculate total from item prices and quantities

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
                    // Find the product by ID to ensure correct stock update
                    const prevProduct = await Product.findById(prevItem.product);
                    if (prevProduct) {
                        prevProduct.stockQuantity += prevItem.quantity;
                        await prevProduct.save();
                    }
                }
                return res.status(404).json({ message: `Sản phẩm ${item.product.name || productId} không tồn tại` }); // Use productId if name is not available
            }

            if (product.stockQuantity < item.quantity) {
                 // Revert stock changes for previous items if any
                 for(const prevItem of orderItems) {
                     // Find the product by ID to ensure correct stock update
                      const prevProduct = await Product.findById(prevItem.product);
                     if (prevProduct) {
                         prevProduct.stockQuantity += prevItem.quantity;
                         await prevProduct.save();
                     }
                 }
                return res.status(400).json({ message: `Không đủ số lượng cho sản phẩm ${product.name}` });
            }

            // Decrease stock quantity
            product.stockQuantity -= item.quantity;
            await product.save();

            // Add item to order items
            orderItems.push({
                // Create ObjectId from the string ID if it's a string, otherwise use directly
                product: mongoose.Types.ObjectId.isValid(productId) ? new mongoose.Types.ObjectId(productId) : productId, 
                quantity: item.quantity,
                price: product.price // Use current product price for order item
            });
            calculatedItemsTotal += product.price * item.quantity; // Calculate total from items
        }

        // Calculate final total including shipping fee
        const finalTotalAmount = calculatedItemsTotal + SHIPPING_FEE;

        // Create new order
        const newOrder = new Order({
            user: userId,
            items: orderItems,
            totalAmount: finalTotalAmount, // Use final calculated total
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

// Get all orders (for owner)
export const getAllOrders = async (req, res) => {
    console.log('Received GET request to /api/orders/all');
    try {
        const orders = await Order.find()
            .populate('user', 'name phone address') // Populate user details
            .populate('items.product', 'name imageUrl price'); // Populate product details

        console.log('Fetched and populated orders:', orders);

        // Log details of items to check product data
        orders.forEach(order => {
            order.items.forEach(item => {
                console.log('Populated Item Product:', item.product);
            });
        });

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update order status (for owner)
export const updateOrderStatus = async (req, res) => {
    console.log(`Received PUT request to /api/orders/${req.params.id}/status`);
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        // Validate the new status (optional but recommended)
        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status: status },
            { new: true } // Return the updated document
        )
        .populate('user', 'name phone address') // Populate user details in response
        .populate('items.product', 'name imageUrl price'); // Populate product details in response

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get revenue data based on period for charting
export const getRevenue = async (req, res) => {
    console.log(`Received GET request to /api/orders/revenue with query: ${JSON.stringify(req.query)}`);
    try {
        const { period = 'month' } = req.query;

        let startDate;
        const now = new Date();
        let groupFormat; // MongoDB aggregation format string

        switch (period) {
            case 'day':
                startDate = startOfDay(now);
                 groupFormat = '%Y-%m-%dT%H:00:00.000Z'; // Group by hour (ISO 8601)
                break;
            case 'week':
                startDate = startOfWeek(now, { weekStartsOn: 1 });
                 groupFormat = '%Y-%m-%dT00:00:00.000Z'; // Group by day
                break;
            case 'month':
                startDate = startOfMonth(now);
                 groupFormat = '%Y-%m-%dT00:00:00.000Z'; // Group by day
                break;
            case 'quarter':
                const currentMonth = now.getMonth();
                const quarter = Math.floor(currentMonth / 3);
                startDate = new Date(now.getFullYear(), quarter * 3, 1);
                 startDate = startOfMonth(startDate);
                 groupFormat = '%Y-%m-01T00:00:00.000Z'; // Group by month
                break;
            case 'year':
                startDate = startOfYear(now);
                 groupFormat = '%Y-%m-01T00:00:00.000Z'; // Group by month
                break;
            case 'last3months':
                startDate = subMonths(startOfMonth(now), 3);
                 groupFormat = '%Y-%m-01T00:00:00.000Z'; // Group by month
                break;
            case 'lastyear':
                startDate = subYears(startOfYear(now), 1);
                 groupFormat = '%Y-%m-01T00:00:00.000Z'; // Group by month
                break;
            default:
                 startDate = startOfMonth(now);
                 groupFormat = '%Y-%m-%dT00:00:00.000Z'; // Default to day for monthly view
        }

        console.log('Calculating revenue from:', startDate, 'grouping by:', groupFormat);

        const revenueData = await Order.aggregate([
            {
                $match: {
                    status: 'Delivered',
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
                    dailyRevenue: { $sum: '$totalAmount' }
                }
            },
            {
                $sort: { _id: 1 } // Sort by the grouped date/time string
            }
        ]);

        console.log('Aggregated raw revenue data:', revenueData);

        // Return the raw aggregated data, frontend will handle intervals and formatting
        res.status(200).json({ period, aggregatedData: revenueData, startDate, endDate: now, groupFormat });

    } catch (error) {
        console.error('Error fetching revenue data:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}; 