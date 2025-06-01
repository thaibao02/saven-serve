import { Schema, model, Types } from 'mongoose';

const OrderItemSchema = new Schema({
    product: {
        type: Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    } // Price at the time of order
});

const OrderSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [OrderItemSchema], // Array of items in the order
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        type: String,
        required: false // Optional, can be taken from user profile
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Order = model('Order', OrderSchema);

export default Order;