const express = require('express');
const {
	getUserWishlist,
	getAllProducts,
	getSingleProduct,
	createProduct,
	deleteProduct,
	addToUsersWishlist,
	removeFromUsersWishlist,
    userIsAdmin,
	addToCart,
	getUsersCart,
	removeFromUsersCart
} = require('../products/controller/productController');
const { checkUserIsLoggedIn } = require("../util/jwtMiddleware");
const router = express.Router();

router.get('/get-users-wishlist', checkUserIsLoggedIn, getUserWishlist);

router.get('/get-all-products', getAllProducts);

router.get('/product/:id', getSingleProduct);

router.post('/create-product', checkUserIsLoggedIn, userIsAdmin, createProduct);

router.delete('/delete-product/:id', checkUserIsLoggedIn, userIsAdmin, deleteProduct);

router.post('/add-to-wishlist/:id', checkUserIsLoggedIn, addToUsersWishlist);

router.post('/add-to-cart/:id', checkUserIsLoggedIn, addToCart);

router.delete('/remove-from-wishlist/:id', checkUserIsLoggedIn, removeFromUsersWishlist);

router.get('/checkout', checkUserIsLoggedIn, getUsersCart);

router.delete('/remove-from-cart/:id', checkUserIsLoggedIn, removeFromUsersCart);

module.exports = router;