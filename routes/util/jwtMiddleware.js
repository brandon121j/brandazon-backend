const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

function jwtMiddleware(req, res, next) {
	const token = req.cookies.access_token;

	if (!token) {
		throw { message: "You don't have permission" };
	}

	try {
        const data = jwt.verify(token, process.env.JWT_SECRET)
	} catch (e) {
		res.status(500).json({ message: 'ERROR', error: e.message });
	}
}

module.exports = { jwtMiddleware };
