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
			userID: decodedToken.userID,
		}).populate('usersWishlist');

		res.json({ wishlist: foundUser.usersWishlist });
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

		res.json({ message: 'SUCCESS', payload: singleProduct });
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

			const { category, title, description, images, images_id, price } = fields;

			const img = files.image.filepath;

			cloudinary.uploader.upload(img, { folder: 'brandazon' }, async (error, result) => {
					if (error) {
						return res.status(500).json({ ERROR: error });
					} else {
						const createdProduct = new Products({
							category,
							title,
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

		const foundUser = await Users.findOne({ userID: decodedToken.userID });

		foundUser.usersWishlist.push(req.params.id);

		await foundUser.save();

		res.json({
			message: 'SUCCESS',
			payload: "Product added to wishlist!",
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

		const foundUser = await Users.findOne({ userID: decodedToken.userID });

		const filteredWishlist = foundUser.usersWishlist.filter((item) => {
			return item.toString() !== product._id.toString();
		});

		foundUser.usersWishlist = filteredWishlist;

		await foundUser.save()

		res.json({
			message: 'SUCCESS',
			deleted: "Product removed from wishlist!",
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

		const foundUser = await Users.findOne({ userID: decodedToken.userID });

		if (!foundUser.isAdmin) {
			res
				.status(500)
				.json({ message: 'ERROR', error: 'User does not have permission' });
		} else {
			next();
		}
	} catch (err) {}
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
};
