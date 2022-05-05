const bcrypt = require('bcryptjs');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const errorHandler = require('../../util/errorHandler');

async function createUser(req, res) {
	const { firstName, lastName, email, password } = req.body;
	try {
		let salt = await bcrypt.genSalt(12);

		let hashedPassword = await bcrypt.hash(password, salt);

		const createdUser = new User({
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: hashedPassword,
		});

		let savedUser = await createdUser.save();

		const cleanSavedUser = {
			id: savedUser.id,
			firstName: savedUser.firstName,
			lastName: savedUser.lastName,
			email: savedUser.email,
			isAdmin: savedUser.isAdmin,
		};

		res.json({
			message: 'Success! account created',
			savedUser: cleanSavedUser,
		});
	} catch (err) {
		res.status(500).json({
			message: 'ERROR',
			error: errorHandler(err),
		});
	}
}

async function login(req, res) {
	const { email, password } = req.body;

	try {
		const foundUser = await User.findOne({ email: email });

		if (!foundUser) {
			res.status(404).json({
				message: 'error',
				error: 'User not found. Please sign up!',
			});
		} else {
			const comparedPassword = await bcrypt.compare(
				password,
				foundUser.password
			);

			if (!comparedPassword) {
				res.status(500).json({
					message: 'error',
					error: 'Incorrect login information. Please try again',
				});
			} else {
				const jwtToken = jwt.sign(
					{
						userID: foundUser.id,
						iat: Date.now(),
					},
					process.env.JWT_SECRET,
					{ expiresIn: '24h' }
					);
					
					const cleanFoundUser = {
						id: foundUser.id,
						firstName: foundUser.firstName,
						lastName: foundUser.lastName,
						email: foundUser.email,
						isAdmin: foundUser.isAdmin,
						wishlist: foundUser.wishlist,
						cart: foundUser.cart
					};
					
					res.cookie('access_token', jwtToken);
					
					res.send({ user: cleanFoundUser });
					console.log('LOGIN COOKIE: ', jwtToken);
				}
		}
	} catch (err) {
		res.status(500).json({
			message: 'ERROR',
			error: errorHandler(err),
		});
	}
}

function signout(req, res) {
	res.clearCookie('access_token').send({ message: "USER SIGNED OUT!"})
}

async function makeUserAdmin(req, res) {
	try {
		const decodedToken = req.cookies.decodedToken;

		const foundUser = await User.findOne({ userID: decodedToken.userID });

		foundUser.isAdmin = true;

		await foundUser.save();

		res.send({
			message: "SUCCESS",
			isAdmin: foundUser.isAdmin
		});
	} catch(err) {
		res.status(500).json({
			message: "ERROR",
			error: errorHandler(err)
		});
	}
}

async function getUserInfo(req, res) {
	try {
		console.log('User Controller: ', req.cookies);
		const decodedToken = req.cookies.decodedToken;

		const foundUser = await User.findOne({ userID: decodedToken.userID });

		const cleanFoundUser = {
			id: foundUser.id,
			firstName: foundUser.firstName,
			lastName: foundUser.lastName,
			email: foundUser.email,
			isAdmin: foundUser.isAdmin,
			wishlist: foundUser.wishlist,
			cart: foundUser.cart
		};

		res.send({
			user: cleanFoundUser
		})
	} catch(err) {
		res.status(500).json({message: "ERROR", error: errorHandler(err) })
	}
}

async function emptyCart(req, res) {
	try {
	const decodedToken = req.cookies.decodedToken;

	const foundUser = await User.findOne({ userID: decodedToken.userID });

	foundUser.cart = [];

	await foundUser.save()

	const cleanFoundUser = {
		id: foundUser.id,
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
	} catch(err) {
		res.status(500).json({message: "ERROR", error: errorHandler(err) })
	}
}


module.exports = {
	createUser,
	login,
	signout,
	makeUserAdmin,
	getUserInfo,
	emptyCart
};
