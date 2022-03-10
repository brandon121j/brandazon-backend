const mongoose = require('mongoose');
const validator = require('validator');
const Users = require('../../users/model/User');
const Products = require('../model/Product');

dotenv.config();

cloudinary.config({
	cloud_name: process.env.cloud_name,
	api_key: process.env.api_key,
	api_secret: process.env.api_secret,
});



async function getUserWishlist (req, res) {
    try {

        let decodedData = res.locals.decodedData;

        let foundUser = await Users.findOne({ email: decodedData.email }).populate('usersWishlist');

        res.json({ payload: foundUser })

    } catch(err) {
        res.status(500).json({
            message: "ERROR",
            error: "User not found"
        })
    }
}

async function getProducts(req, res, next) {
    try {
        const foundProducts = await Products.find({});

        res.send(foundProducts)
    } catch(err) {
        next(err);
    }
}

async function getSingleProduct(req, res) {
    try {
        let singleProduct = await Products.findById(req.params.id);

        res.json({ message: "SUCCESS", payload: singleProduct });
    } catch(err) {
        res.status(404).json({
            message: "ERROR",
            error: "Product not found"
        })
    }
}

async function getUsersWishlist(req, res) {
    try {
        let decodedData = res.locals.decodedData;

        let foundUser = await Users.findOne({
            email: decodedData.email
        }).populate('usersWishlist')
    } catch(err) {

    }
}

module.exports = {
    getUserWishlist,
    getProducts,
    getSingleProduct,
    getUserWishlist
}