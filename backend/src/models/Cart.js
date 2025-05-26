import { Schema, Types, model } from "mongoose";

const Cart = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // mỗi user chỉ có 1 giỏ hàng active
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

export default model("Cart", Cart);

