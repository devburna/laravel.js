var bcryptjs = require('bcryptjs');
var jwt = require('jsonwebtoken');

const config = require('../config');
const db = require('../database');
const mail = require('../mailer/mailables');
const trans = require('../resources/lang/en');

const { user } = db.models;

module.exports = {
    register: (req, res) => {

        const { username, email, password } = req.query;

        if (!username) {
            res.status(400).send({
                status: false,
                message: "Username is required."
            });
        };

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


        user.findOne({ email: email }, (err, data) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: 'We could not create your account please contact support.',
                });

            } else if (data) {
                res.status(400).send({
                    status: false,
                    message: trans.emails.exists
                });

            } else {
                const userData = new user({
                    username: username,
                    email: email?.trim()?.toLowerCase(),
                    password: bcryptjs.hashSync(password, 8)
                });

                userData.save((err, data) => {
                    if (err) {
                        res.status(422).send({
                            status: false,
                            message: 'We could not create your account please contact support.',
                        });

                    }

                    mail.sendVerificationEmail({
                        id: data._id,
                        avatar: data.avatar,
                        username: data.username,
                        email: data.email,
                        emailVerifiedAt: data.emailVerifiedAt,
                        createdAt: data.createdAt
                    });

                    res.status(201).send({
                        status: true,
                        message: 'Your account was registered successfully!',
                    });
                });
            };
        });
    },
    verify: (req, res) => {
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
                    user.findOne({ email: decoded.user.email }, (err, data) => {
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
    },
    login: (req, res) => {
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

        user.findOne({ email: email }, (err, data) => {
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
    },
    recover: (req, res) => {
        const { email } = req.query;

        if (!email) {
            res.status(400).send({
                status: false,
                message: "Email is required."
            });
        };

        user.findOne({ email: email }, (err, data) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: trans.passwords.failed.recover,
                });

            } else if (!data) {
                res.status(404).send({
                    status: false,
                    message: trans.auth.failed
                });

            } else {
                mail.sendRecoveryEmail({
                    email: data.email
                });

                res.status(200).send({
                    status: true,
                    message: trans.passwords.sent,
                });
            };
        });
    },
    reset: (req, res) => {
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
                    user.findOne({ email: decoded.user.email }, (err, data) => {
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
    },
    user: (req, res) => {

        res.status(200).send({
            status: true,
            message: 'Authenticated.',
            data: {
                id: req.user.id,
                avatar: req.user.avatar,
                username: req.user.username,
                email: req.user.email,
                emailVerifiedAt: req.user.emailVerifiedAt,
                createdAt: req.user.createdAt
            }
        });
    }
};