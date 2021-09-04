var bcryptjs = require('bcryptjs');
var jwt = require('jsonwebtoken');

const config = require('../config');
const db = require('../database');
const mail = require('../mailer/mailables');
const trans = require('../resources/lang/en');

const { userModel } = db.models;

module.exports = {
    index: (req, res) => {
        const { token, new_password, password_confirmation } = req.query;

        if (!token) {
            res.status(400).send({
                status: false,
                message: trans.passwords.token
            });
        } else if (!new_password) {
            res.status(400).send({
                status: false,
                message: 'New password is required.'
            });
        } else if (!password_confirmation) {
            res.status(400).send({
                status: false,
                message: 'Please confirm password.'
            });
        } else if (new_password !== password_confirmation) {
            res.status(400).send({
                status: false,
                message: 'Passwords mis-matched.'
            });
        } else {
            jwt.verify(token, config.app.key, (err, decoded) => {
                if (err || !decoded && !decoded.user) {
                    res.status(422).send({
                        status: false,
                        message: trans.passwords.token
                    });
                } else {
                    userModel.findOne({ email: decoded.user.email }, (err, data) => {
                        if (err) {
                            res.status(422).send({
                                status: false,
                                message: trans.passwords.failed.reset
                            });
                        } else if (!data) {
                            res.status(404).send({
                                status: false,
                                message: trans.auth.failed
                            });
                        } else {
                            data.password = bcryptjs.hashSync(password_confirmation, 8);

                            data.save((err, info) => {
                                if (err) {
                                    res.status(422).send({
                                        status: false,
                                        message: trans.passwords.failed.reset
                                    });
                                } else {
                                    mail.sendResetEmail({
                                        id: info._id,
                                        avatar: info.avatar,
                                        username: info.username,
                                        email: info.email,
                                        emailVerifiedAt: info.emailVerifiedAt,
                                        createdAt: info.createdAt
                                    });

                                    res.status(200).send({
                                        status: true,
                                        message: trans.passwords.reset
                                    });
                                }
                            });
                        }
                    });
                };
            });
        };
    }
};