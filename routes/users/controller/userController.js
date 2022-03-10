const bcrypt = require('bcryptjs');
const User = require('../model/User');
const jwt = require('jsonwebtoken');

async function createUser(req, res, next) {
    const { firstName, lastName, email, password } = req.body;
    try {
        let salt = await bcrypt.genSalt(12);

        let hashedPassword = await bcrypt.hash(password, salt);

        const createdUser = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword
        });

        let savedUser = await createdUser.save();

        res.json({
            message: "Success! user created",
            savedUser: savedUser
        })

    } catch(err) {
        console.log(err)
    }
}

async function login(req, res, next) {
    const { email, password } = req.body;

    try {
        const foundUser = await User.findOne({ email: email, password: password });

        if (!foundUser) {
            res.status(404).json({
                message : "error",
                error: "User not found. Please sign up!"
            })
        }

        const jwtToken = jwt.sign({
            userID: foundUser.id,
            iat: Date.now()
        }, process.env.JWT_SECRET, 
        { expiresIn: "24h"})

        const cleanFoundUser = {
            id: foundUser.id,
            firstName: foundUser.firstName,
            lastName: foundUser.lastName,
            email: foundUser.email,
            isAdmin: foundUser.isAdmin
        }
        
        res.cookie('session_token', jwtToken, { secure: false, httpOnly: true });

        res.send({ user: cleanFoundUser })

    } catch(err) {
        res.json({
        message: "ERROR",
        error: err
        })
    }
}

function signout(req, res) {
    res.clearCookie('session_token').send('Sign out successful')
}

module.exports = {
    createUser,
    login,
    signout
}