const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please input first name'],
        match: [/^[a-z]+$/i, 'Cannot contain special characters or numbers'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Please input last name'],
        match: [/^[a-z]+$/i, 'Cannot contain special characters or numbers'],
        trim: true
    },
    email: {
        type: String,
		unique: true,
        dropDups: true,
		required: [true, 'Please provide your email'],
		lowercase: true,
		validate: [validator.isEmail, 'Please provide a valid email'],
		trim: true
    },
    password: {
        type: String,
        required: [true, 'Please input password'],
        minlength: 4,
        trim: true
    },
    isAdmin: { type: Boolean, required: true, default: false},
    wishlist: [{ type: mongoose.Schema.ObjectId, ref: 'products'}],
    cart: [{ _id: false, type: mongoose.Schema.ObjectId, ref: 'products'}, {_id: false}]
}, { timestamps: true })

module.exports = mongoose.model('user', userSchema);