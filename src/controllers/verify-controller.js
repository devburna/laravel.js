var jwt = require('jsonwebtoken');

const config = require('../config');
const db = require('../database');
const mail = require('../mailer/mailables');
const trans = require('../resources/lang/en');

const { userModel } = db.models;

module.exports = {
    index: (req, res) => {
        const { token } = req.query;

        if (!token) {
            res.status(400).send({
                status: false,
                message: trans.emails.failed
            });
        } else {
            jwt.verify(token, config.app.key, (err, decoded) => {
                if (err || !decoded && !decoded.user) {
                    res.status(422).send({
                        status: false,
                        message: trans.emails.failed
                    });
                } else {
                    userModel.findOne({ email: decoded.user.email }, (err, data) => {
                        if (err) {
                            res.status(422).send({
                                status: false,
                                message: trans.emails.failed
                            });
                        } else if (!data) {
                            res.status(404).send({
                                status: false,
                                message: trans.auth.failed
                            });
                        } else {
                            if (data.emailVerifiedAt) {
                                res.status(422).send({
                                    status: false,
                                    message: trans.emails.verified
                                });
                            } else {
                                data.emailVerifiedAt = new Date();

                                data.save((err, info) => {
                                    if (err) {
                                        res.status(422).send({
                                            status: false,
                                            message: trans.emails.failed
                                        });
                                    } else {
                                        mail.sendVerifiedEmail({
                                            id: info._id,
                                            avatar: info.avatar,
                                            username: info.username,
                                            email: info.email,
                                            emailVerifiedAt: info.emailVerifiedAt,
                                            createdAt: info.createdAt
                                        });

                                        res.status(200).send({
                                            status: true,
                                            data: info,
                                            message: trans.emails.success
                                        });
                                    }
                                });
                            }

                        };
                    });
                };
            });
        };
    }
};