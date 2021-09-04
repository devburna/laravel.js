var bcryptjs = require('bcryptjs');

const db = require('../database');
const mail = require('../mailer/mailables');
const trans = require('../resources/lang/en');

const { userModel } = db.models;

module.exports = {
    index: (req, res) => {

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


        userModel.findOne({ email: email }, (err, data) => {
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
                const userData = new userModel({
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
    }
};