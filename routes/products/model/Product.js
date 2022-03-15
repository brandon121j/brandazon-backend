const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    category: {
        type: String,
        required: [true, 'Category is required'],
    },
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    image: {
        type: String,
        required: [true, 'Image is required']
    },
    image_id: {
        type: String,
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    }
}, { timestamps: true })

module.exports = mongoose.model('products', productSchema)
