var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const verification = require("./verification");
const { app } = require("../../config");
const { mongodb } = require("../../database");

const User = mongodb.models.user;

module.exports = {
    main: function (req, res) {

        const { email, password } = req.query;

        if (!email) {
            return res.status(403).send({
                status: false,
                data: {},
                message: "Email is required!"
            });
        }

        if (!password) {
            return res.status(403).send({
                status: false,
                data: {},
                message: "Password is required!"
            });
        }

        User.findOne({ email: email }, function (err, user) {
            if (err) {
                return res.status(500).send({ status: false, data: {}, message: err });
            }

            if (!user) {
                return res.status(401).send({ status: false, data: {}, message: "These credentials do not match our records!" });
            } else {

                var passwordIsValid = bcrypt.compareSync(
                    password,
                    user.password
                );

                if (!passwordIsValid) {
                    return res.status(401).send({
                        status: false,
                        data: {},
                        message: "The provided password is incorrect!"
                    });
                }

                if (!user.emailVerifiedAt) {
                    // resend verification code to email
                    return verification.emailVerificationLink(req, res)
                } else {

                    user = {
                        name: user.name,
                        email: user.email,
                        emailVerifiedAt: user.emailVerifiedAt,
                        createdAt: user.createdAt,
                    };

                    var token = jwt.sign({ user: user }, app.key, {
                        expiresIn: 86400 // 24 hours
                    });

                    user.token = token;

                    return res.status(200).send({
                        status: true,
                        data: user,
                        message: "User was logged in successfully!"
                    });
                }
            }
        });
    }
}