const express = require('express');
const {
	getUserWishlist,
	getAllProducts,
	getSingleProduct,
	createProduct,
	deleteProduct,
	addToUsersWishlist,
	removeFromUsersWishlist
} = require('../products/controller');


const { checkUserIsLoggedIn } = require("../util/jwtMiddleware");

const router = express.Router();

router.get('/get-users-wishlist', checkUserIsLoggedIn, getUserWishlist);

router.get('/get-all-products', getAllProducts);

router.get('/product/:id', getSingleProduct);

router.post('/create-product', )