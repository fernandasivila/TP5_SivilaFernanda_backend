const mongoose = require('mongoose');
const {Schema} = mongoose;

const productSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    stock:{
        type: Number,
        required: true
    },
    outstanding:{
        type: Boolean,
        required: true
    }
}, { collection: 'products' });

module.exports = mongoose.models.Product || mongoose.model('Product',productSchema);