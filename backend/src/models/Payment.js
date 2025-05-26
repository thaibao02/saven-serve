import { Schema, Types, model } from "mongoose";

const Payment = new Schema({
    order: {
        type: Types.ObjectId,
        ref: 'Order',
        required: true
    },
    paidAmount: {
        type: Number,
        required: true
    },
    method: {
        type: String,
        enum: ['credit_card', 'paypal', 'bank_transfer'],
        required: true
    },
    paidAt: {
        type: Date,
        default: Date.now
    }
});

export default model("Payment", Payment);