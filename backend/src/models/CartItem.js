import { Schema, Types, model } from "mongoose";

const CartItem = new Schema ({
    cart: {
        type: Types.ObjectId,
        ref: 'Cart',
        required: true
    },
    product: {
        type: Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
})
CartItem.index({ cart: 1, product: 1 }, { unique: true });
export default model("CartItem", CartItem);