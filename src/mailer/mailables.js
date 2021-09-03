var jwt = require('jsonwebtoken');

const mail = require('./index');
const config = require('../config');

const mailables = {};

mailables.sendVerificationEmail = (params) => {

    var token = jwt.sign({ user: params }, config.app.key, {
        expiresIn: 3600 // 1 hour
    });

    return mail(params.email, 'Verify Email', 'verify-email', {
        title: 'Verify Email',
        token: `${config.app.url}:${config.app.port}/verify?token=${token}`,
    });
};

mailables.sendRecoveryEmail = (params) => {

    var token = jwt.sign({ user: params }, config.app.key, {
        expiresIn: 3600 // 1 hour
    });

    return mail(params.email, 'Forgot Password', 'forgot-password', {
        title: 'Forgot Password',
        token: `${config.app.url}:${config.app.port}/password-reset?token=${token}`,
    });
};

mailables.sendVerifiedEmail = (params) => {

    return mail(params.email, 'Email Verified', 'email-verified', {
        title: 'Email Verified',
        recepient: params,
    });
};

mailables.sendResetEmail = (params) => {

    return mail(params.email, 'Reset Password Successfull', 'password-reset', {
        title: 'Reset Password Successfull',
        recepient: params,
    });
};

module.exports = mailables;