import {Shemma, model , Types} from 'shema';

const Product = new Shemma ({
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