const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const { checkUserIsLoggedIn } = require('../util/jwtMiddleware');

const { createUser, login, makeUserAdmin, signout, getUserInfo } = require('./controller/userController');

router.post('/create-user', createUser);

router.post('/login', login);

router.post('/make-admin', checkUserIsLoggedIn, makeUserAdmin);

router.post('/signout', checkUserIsLoggedIn, signout);

router.get('/user-info', checkUserIsLoggedIn, getUserInfo)

module.exports = router;
