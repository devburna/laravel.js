var bcrypt = require("bcryptjs");
const verification = require("./verification");
const { mongodb, mysqldb } = require("../../database");
const { verify } = require("../../middleware");

const User = mongodb.models.user;

module.exports = {
    main: function (req, res) {

        const { name, email, password } = req.query;

        if (!name) {
            return res.status(403).send({
                status: false,
                data: {},
                message: "Name is required!"
            });
        }

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

        User.create({
            name: name,
            email: email?.trim()?.toLowerCase(),
            emailVerifiedAt: null,
            password: bcrypt.hashSync(password, 8)
        })
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the blog."
                });
            });


        const userData = new User({
            name: name,
            email: email?.trim()?.toLowerCase(),
            emailVerifiedAt: null,
            password: bcrypt.hashSync(password, 8)
        });

        User.findOne({ email: email }, function (err, user) {
            if (err) {
                return res.status(500).send({ status: false, data: {}, message: err });
            }

            if (user) {
                return res.status(422).send({ status: false, data: {}, message: "Email already exist!" });
            } else {
                userData.save((err, user) => {
                    if (err) {
                        return res.status(500).send({ status: false, data: {}, message: err });
                    }

                    if (!verify) {

                        return res.status(200).send({
                            status: true,
                            data: {
                                name: user.name,
                                email: user.email,
                                emailVerifiedAt: user.emailVerifiedAt,
                                createdAt: user.createdAt,
                            },
                            message: "User was registered successfully!"
                        });
                    } else {

                        // send verification code to email
                        return verification.emailVerificationLink(req, res)
                    }

                });
            }
        });
    }
}