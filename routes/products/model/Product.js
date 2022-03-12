const mongoose = require('mongoose');
const validator = require('validator');
const uuid = require('uuid');

const productSchema = new mongoose.Schema({
    id: { 
        type: String, 
        required: true, 
        default: () => uuid.v4()
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    image: {
        type: String,
        required: true
    },
    image_id: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('products', productSchema)
