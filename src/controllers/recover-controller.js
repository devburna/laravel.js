const db = require('../database');
const mail = require('../mailer/mailables');
const trans = require('../resources/lang/en');

const { userModel } = db.models;

module.exports = {
    index: (req, res) => {
        const { email } = req.query;

        if (!email) {
            res.status(400).send({
                status: false,
                message: "Email is required."
            });
        };

        userModel.findOne({ email: email }, (err, data) => {
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
    }
};