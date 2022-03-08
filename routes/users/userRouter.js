const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const { createUser, login } = require('./controller/userController');

router.post('/create-user', createUser);

router.post('/login', login);

module.exports = router;
