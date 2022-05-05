const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const { checkUserIsLoggedIn } = require('../util/jwtMiddleware');

const { createUser, login, makeUserAdmin, signout, getUserInfo, emptyCart } = require('./controller/userController');

router.post('/create-user', createUser);

router.post('/login', login, checkUserIsLoggedIn);

router.post('/make-admin', checkUserIsLoggedIn, makeUserAdmin);

router.post('/signout', checkUserIsLoggedIn, signout);

router.get('/user-info', checkUserIsLoggedIn, getUserInfo);

router.delete('/empty-cart', checkUserIsLoggedIn, emptyCart);



module.exports = router;
