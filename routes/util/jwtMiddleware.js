const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

function jwtMiddleware(req, res, next) {
	const token = req.cookies.access_token;

	if (!token) {
		throw { message: "You don't have permission" };
	}

	try {
		const data = jwt.verify(token, process.env.JWT_SECRET)
		

		next();
	} catch (err) {
		res.status(500).json({ message: 'ERROR', error: err.message });
	}
}

module.exports = { jwtMiddleware };
