const bcrypt = require('bcryptjs');
const Users = require('../model/Users');
const jwt = require('jsonwebtoken');

async function createUser(req, res, next) {
    const { firstName, lastName, email, password } = req.body;

    try {
        let salt = await bcrypt.genSalt(12);

    } catch(err) {

    }
}