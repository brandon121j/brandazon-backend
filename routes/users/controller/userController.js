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
        let foundUser = await User.findOne({ email: email });

        if (!foundUser) {
            res.status(404).json({
                message: "ERROR",
                error: "User not found"
            })
        } else {
            let comparedPassword = await bcrypt.compare(password, foundUser.password);

            if (!comparedPassword) {
                res.status(404).json({
                    message: "ERROR",
                    error: "Incorrect login credentials"
                })
            } else {
                let jwtToken = jwt.sign({
                    firstName: foundUser.firstName,
                    lastName: foundUser.lastName,
                    email: foundUser.email,
                    id: foundUser.id,
                    isAdmin: foundUser.isAdmin
                }, 
                process.env.JWT_SECRET,
                { expiresIn: "24h"});

                res.json({
                    message: "SUCCESS",
                    token: jwtToken
                });
            }
        }
    } catch(err) {
        res.json({
        message: "ERROR",
        error: err
        })
    }
}

module.exports = {
    createUser,
    login
}