var bcryptjs = require('bcryptjs');
var jwt = require('jsonwebtoken');

const config = require('../config');
const db = require('../database');
const trans = require('../resources/lang/en');

const { userModel } = db.models;

module.exports = {
    index: (req, res) => {
        const { email, password } = req.query;

        if (!email) {
            res.status(400).send({
                status: false,
                message: "Email is required."
            });
        };

        if (!password) {
            res.status(400).send({
                status: false,
                message: "Password is required."
            });
        };

        userModel.findOne({ email: email }, (err, data) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: 'Unable to login your account please contact support.',
                });

            } else if (!data) {
                res.status(404).send({
                    status: false,
                    message: trans.auth.failed
                });

            } else {
                var passwordIsValid = bcryptjs.compareSync(
                    password,
                    data.password
                );

                if (!passwordIsValid) {
                    res.status(400).send({
                        status: false,
                        message: trans.auth.password
                    });
                } else {

                    const userData = {
                        id: data._id,
                        avatar: data.avatar,
                        username: data.username,
                        email: data.email,
                        emailVerifiedAt: data.emailVerifiedAt,
                        createdAt: data.createdAt
                    };

                    var token = jwt.sign({ user: userData }, config.app.key, {
                        expiresIn: 86400 // 24 hours
                    });

                    res.status(200).send({
                        status: true,
                        message: 'Authenticated.',
                        data: {
                            token: token,
                            user: userData
                        }
                    });
                };
            };
        });
    }
};