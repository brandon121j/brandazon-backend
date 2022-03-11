const Users = require('../../users/model/User');
const Products = require('../model/Product');
const errorHandler = require('../../util/errorHandler');
const formidable = require('formidable');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary');
const User = require('../../users/model/User');

dotenv.config();

cloudinary.config({
	cloud_name: process.env.cloud_name,
	api_key: process.env.api_key,
	api_secret: process.env.api_secret,
});

async function getUserWishlist(req, res) {
	try {
		const decodedToken = req.cookies.decodedToken;

		const foundUser = await Users.findOne({ email: decodedToken.email }).populate(
			'usersWishlist'
		);

		res.json({ payload: foundUser });
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
				res.status(500).json({ message: 'ERROR', error: errorHandler(err) });
			}

			const { category, title, description, image, price } = fields;

			cloudinary.uploader.upload(files.image.filepath, async (err, result) => {
				if (err) {
					return res.status(500);
				} else {
					const createdProduct = new Products({
						category,
						title,
						description,
						image: result.secure_url,
						price,
						image_id: result.public_id
					});

					const savedProduct = await createdProduct.save();

					res.json({
						message: "SUCCESS",
						payload: savedProduct
					});
				}
			});
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR",
			error: errorHandler(err)
		});
	}
}

async function deleteProduct(req, res) {
	try {
		const image = await Products.findById(req.params.id);

		cloudinary.uploader.destroy(image.image_id, function(payload) {console.log(payload)});

		const deletedProduct = await Products.findByIdAndDelete(req.params.id);

		res.json({
			message: "SUCCESS",
			deletedProduct: deletedProduct
		})
	} catch(err) {

	}
}

async function addToUsersWishlist(req, res) {
	try {
		const decodedToken = req.cookies.decodedToken;

		const foundUser = await Users.findOne({ email: decodedToken.email });

		foundUser.usersWishlist.push(req.params.id);

		await foundUser.save();

		res.json({
			message: "SUCCESS",
			payload: foundUser.usersWishlist
		})
	} catch(err) {
		res.status(500).json({
			message: "ERROR",
			error: errorHandler(err)
		})
	}
}

async function removeFromUsersWishlist(req, res) {
	try {
		const product = await Products.findById(req.params.id);

		const decodedToken = req.cookies.decodedToken;

		const foundUser = Users.findOne({ email: decodedToken.email });

		const filteredWishlist = foundUser.usersWishlist.filter((item) => {
			return item.toString() !== product.id.toString()
		});

		foundUser.wishList = filteredWishlist;

		res.json({
			message: "SUCCESS",
			deleted: foundUser.wishlist
		});
	} catch(err) {
		res.status(500).json({
			message: "ERROR",
			error: errorHandler(err)
		});
	}
}

module.exports = {
	getUserWishlist,
	getAllProducts,
	getSingleProduct,
	createProduct,
	deleteProduct,
	addToUsersWishlist,
	removeFromUsersWishlist
};
