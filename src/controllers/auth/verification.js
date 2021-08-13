const jwt = require("jsonwebtoken");
const { app } = require("../../config");
const { verify, verified } = require("../../mail");
const { mongodb } = require("../../database");
const User = mongodb.models.user;

module.exports = {
    emailVerificationLink: function (req, res) {

        const { email } = req.query;

        var token = jwt.sign({ email: email }, app.key, {
            expiresIn: 7200  // 1 hour
        });

        if (verify({
            email: email,
            token: token
        })) {
            return res.status(200).send({
                status: true,
                data: {},
                message: "A link was sent to your email for verification!"
            });
        } else {
            return res.status(500).send({
                status: false,
                data: {},
                message: "Unable to send email verification link!"
            });
        }
    },
    verify: function (req, res) {

        const { token } = req.query;

        if (!token) {
            return res.status(500).send({
                status: false,
                data: {},
                message: "Token is required to verify email!"
            });
        }

        jwt.verify(token, app.key, (err, decoded) => {
            if (err) {
                return res.status(403).send({
                    status: false,
                    data: {},
                    message: "Expired token!"
                });
            }

            User.findOne({ email: decoded.email }, (err, user) => {
                if (err || !user) {
                    return res.status(403).send({ status: false, data: {}, message: "These credentials do not match our records!" });
                }

                if (user.emailVerifiedAt) {
                    return res.status(422).send({ status: false, data: {}, message: "Email has already been verified!" });
                }

                user.emailVerifiedAt = new Date();

                user.save((err, _) => {
                    if (err) {
                        return res.status(500).send({ status: false, data: {}, message: "Unable to verify email!" });
                    }

                    if (verified({
                        email: user.email,
                    })) {

                        return res.status(200).send({
                            status: true,
                            data: {},
                            message: "Email was verified successfully!"
                        });
                    } else {
                        return res.status(500).send({
                            status: false,
                            data: {},
                            message: "Unable to send email verification link!"
                        });
                    }
                });
            })
        });
    }
}