const { app, mail } = require("../config");

module.exports = (params) => {
    try {
        mail.sendMail({
            from: 'noreply@gmail.com',
            to: params.email,
            subject: 'Email verified',
            template: 'verified',
        });

        return true;
    } catch (error) {

        return false;
    }
}