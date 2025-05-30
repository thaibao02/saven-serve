import { Schema, model , Types} from 'mongoose';

const Product = new Schema ({
    owner : {
        type : Types.ObjectId,
        ref : 'User',
        required: true
    },
    name : {
        type : String,
        required: true
    },
    description : {
        type : String,
        required: true
    },
    price : {
        type : Number,
        required: true
    },
    stockQuantity : {
        type : Number,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ["Trái Cây", "Rau xanh", "Đố uống", "Gia vị ", "Sữa", "Thịt", "Cá"]
    },
    images: [{
        type: String,
        required: true
    }],
    createdAt : {
        type : Date,
        default: Date.now
    },
    updatedAt : {
        type : Date,
        default: Date.now
    }
})

export default model('Product', Product);