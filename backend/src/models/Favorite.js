import { Schema, Types, model } from "mongoose";

const Favorite = new Schema ({
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: Types.ObjectId,
        ref: 'Product',
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});

export default model("Favorite", Favorite);