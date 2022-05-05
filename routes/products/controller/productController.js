const Users = require('../../users/model/User');
const Products = require('../model/Product');
const errorHandler = require('../../util/errorHandler');
const formidable = require('formidable');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;

dotenv.config();

cloudinary.config({
	cloud_name: process.env.cloud_name,
	api_key: process.env.api_key,
	api_secret: process.env.api_secret,
});

async function getUserWishlist(req, res) {
	try {
		const decodedToken = req.cookies.decodedToken;

		const foundUser = await Users.findOne({
			_id: decodedToken.userID,
		})

		const usersWishlist = await Products.find({_id: foundUser.wishlist});

		res.json({ wishlist: usersWishlist });
	} catch (err) {
		res.status(500).json({
			message: 'ERROR',
			error: errorHandler(err),
		});
	}
}

async function getAllProducts(req, res, next) {
	try {
		const allProducts = await Products.find({});

		res.send(allProducts);
	} catch (err) {
		next(err);
	}
}

async function getSingleProduct(req, res) {
	try {
		const singleProduct = await Products.findById(req.params.id);

		const otherProducts = await Products.find( { _id: { $nin: req.params.id } } );

		res.json({ message: 'SUCCESS', productInfo: singleProduct, otherProducts: otherProducts });
	} catch (err) {
		res.status(500).json({
			message: 'ERROR',
			error: errorHandler(err),
		});
	}
}

async function createProduct(req, res) {
	try {
		const form = formidable({ multiples: true });
		
		form.parse(req, (err, fields, files) => {
			if (err) {
				res.status(500).json({
					message: 'ERROR',
					error: errorHandler(err),
				});
			}
			
			const { category, title, brand, description, image, image_id, price } = fields;
			const img = files.image.filepath;
			cloudinary.uploader.upload(
				img,
				{ folder: 'brandazon' },
				async (error, result) => {
					if (error) {
						return res.status(500).json({ ERROR: error });
					} else {
						const createdProduct = new Products({
							category,
							title,
							brand,
							description,
							image: result.secure_url,
							image_id: result.public_id,
							price,
						});

						await createdProduct.save();

						res.send({ createdProduct });
					}
				}
			);
		});
	} catch (err) {
		res.status(500).json({
			message: 'ERROR',
			error: errorHandler(err),
		});
	}
}

async function deleteProduct(req, res) {
	try {
		const image = await Products.findById(req.params.id);

		cloudinary.uploader.destroy(image.image_id, function (payload) {
			console.log(payload);
		});

		const deletedProduct = await Products.findByIdAndDelete(req.params.id);

		res.json({
			message: 'SUCCESS',
			deletedProduct: deletedProduct,
		});
	} catch (err) {
		res.status(500).json({
			message: 'ERROR',
			error: errorHandler(err),
		});
	}
}

async function addToUsersWishlist(req, res) {
	try {
		const decodedToken = req.cookies.decodedToken;

		const foundUser = await Users.findOne({ _id: decodedToken.userID });

		foundUser.wishlist.push(req.params.id);

		await foundUser.save();

		const cleanFoundUser = {
			id: foundUser._id,
			firstName: foundUser.firstName,
			lastName: foundUser.lastName,
			email: foundUser.email,
			isAdmin: foundUser.isAdmin,
			wishlist: foundUser.wishlist,
			cart: foundUser.cart,
		};

		res.json({
			message: 'Product added to wishlist!',
			user: cleanFoundUser,
		});
	} catch (err) {
		res.status(500).json({
			message: 'ERROR',
			error: errorHandler(err),
		});
	}
}

async function addToCart(req, res) {
	try {
		const decodedToken = req.cookies.decodedToken;

		const foundUser = await Users.findOne({ _id: decodedToken.userID });

		foundUser.cart.push(req.params.id);

		await foundUser.save();

		const cleanFoundUser = {
			id: foundUser._id,
			firstName: foundUser.firstName,
			lastName: foundUser.lastName,
			email: foundUser.email,
			isAdmin: foundUser.isAdmin,
			wishlist: foundUser.wishlist,
			cart: foundUser.cart,
		};

		res.json({
			message: 'Product added to cart!',
			user: cleanFoundUser,
		});
	} catch (err) {
		res.status(500).json({
			message: 'ERROR',
			error: errorHandler(err),
		});
	}
}

async function getUsersCart(req, res) {
	try {
		const decodedToken = req.cookies.decodedToken;
		console.log('!!!DECODED TOKEN!!!', decodedToken);
		const foundUser = await Users.findOne({
			_id: decodedToken.userID,
		})

		const usersCart = await Products.find({_id: foundUser.cart});

		res.json({ cart: usersCart });
	} catch (err) {
		res.status(500).json({
			message: 'ERROR',
			error: errorHandler(err),
		});
	}
}

async function removeFromUsersCart(req, res) {
	try {
		const product = await Products.findById(req.params.id);

		const decodedToken = req.cookies.decodedToken;

		const foundUser = await Users.findOne({ _id: decodedToken.userID });

		const filteredCart = foundUser.cart.filter((item) => {
			return item.toString() !== product._id.toString();
		});

		foundUser.cart = filteredCart;

		await foundUser.save();

		const cleanFoundUser = {
			id: foundUser._id,
			firstName: foundUser.firstName,
			lastName: foundUser.lastName,
			email: foundUser.email,
			isAdmin: foundUser.isAdmin,
			wishlist: foundUser.wishlist,
			cart: foundUser.cart,
		};

		res.json({
			message: 'Product removed from cart!',
			user: cleanFoundUser,
		});
	} catch (err) {
		res.status(500).json({
			message: 'ERROR',
			error: errorHandler(err),
		});
	}
}


async function removeFromUsersWishlist(req, res) {
	try {
		const product = await Products.findById(req.params.id);

		const decodedToken = req.cookies.decodedToken;

		const foundUser = await Users.findOne({ _id: decodedToken.userID });

		const filteredWishlist = foundUser.wishlist.filter((item) => {
			return item.toString() !== product._id.toString();
		});

		foundUser.wishlist = filteredWishlist;

		await foundUser.save();

		const cleanFoundUser = {
			id: foundUser._id,
			firstName: foundUser.firstName,
			lastName: foundUser.lastName,
			email: foundUser.email,
			isAdmin: foundUser.isAdmin,
			wishlist: foundUser.wishlist,
			cart: foundUser.cart,
		};

		res.json({
			message: 'Product removed from wishlist',
			user: cleanFoundUser,
		});
	} catch (err) {
		res.status(500).json({
			message: 'ERROR',
			error: errorHandler(err),
		});
	}
}

async function userIsAdmin(req, res, next) {
	try {
		const decodedToken = req.cookies.decodedToken;

		const foundUser = await Users.findOne({ _id: decodedToken.userID });

		if (!foundUser.isAdmin) {
			res
				.status(500)
				.json({ message: 'ERROR', error: 'User does not have permission' });
		} else {
			next();
		}
	} catch (err) {
		console.log(err);
	}
}

module.exports = {
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
	removeFromUsersCart,
};
