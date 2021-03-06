const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

function jwtMiddleware(req, res, next) {
	try {
		if (!req.cookies || !req.cookies.access_token) {
			return next();
		}

		const accessToken = req.cookies.access_token;
	
		const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);

		req.cookies.decodedToken = decodedToken;
		
		next();
	} catch (err) {
		res.status(500).json({ message: 'ERROR', error: err.message });
	}
}

// implementing user permission, user must be loggged in.
function checkUserIsLoggedIn(req, res, next) {
	console.log('JWT Middleware 1: ', req.cookie);
	console.log('JWT Middleware 2: ', req.cookies);
	if (req.cookies.access_token) {
		next();
	} else {
		res.status(500).json({ loggedIn: false})
	}
};


module.exports = { jwtMiddleware, checkUserIsLoggedIn};


