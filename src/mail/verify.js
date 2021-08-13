const { app, mail } = require("../config");

module.exports = (params) => {
    try {
        mail.sendMail({
            from: 'noreply@gmail.com',
            to: params.email,
            subject: 'Verify email',
            template: 'verify',
            context: {
                link: `${app.url}:${app.port}/verify?token=${params.token}`,
            }
        });

        return true;
    } catch (error) {

        return false;
    }
}