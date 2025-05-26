import { Schema, Types, model } from "mongoose";

const OrderItem = new Schema({
    order: {
        type: Types.ObjectId,
        ref: 'Order',
        required: true
    },
    product: {
        type: Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    }
});

export default model("OrderItem", OrderItem);