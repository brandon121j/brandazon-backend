const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const { checkUserIsLoggedIn } = require('../util/jwtMiddleware');

const { createUser, login, makeUserAdmin } = require('./controller/userController');

router.post('/create-user', createUser);

router.post('/login', login);

router.post('/make-admin', checkUserIsLoggedIn, makeUserAdmin)

module.exports = router;
