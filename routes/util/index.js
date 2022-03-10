const { errorHandler } = require('./errorHandler');
const { jwtMiddleware } = require('./jwtMiddleware');

module.exports = {
    errorHandler,
    jwtMiddleware
}