import { Schema, Types, model } from "mongoose";

const Message = new Schema({
    senderId: {
        type: Types.ObjectId,
        required: true,
        refPath: 'senderModel'
    },
    senderModel: {
        type: String,
        required: true,
        enum: ['User','Owner']
    },
    receiverId: {
        type: Types.ObjectId,
        required: true,
        refPath: 'receiverModel'
    },
    receiverModel: {
        type: String,
        required: true,
        enum: ['User','Owner']
    },
    content: {
        type: String,
        required: true
    },
    sentAt: {
        type: Date,
        default: Date.now
    }
});

export default model("Message", Message);