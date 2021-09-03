const config = require('../config');
const mail = require('./mail');

module.exports = (to, subject, template, context) => {
    return mail.sendMail({
        from: config.mail.from.address,
        to: to,
        subject: subject,
        template: template,
        context: context
    }).then(() => {
        return true
    }).catch(() => {
        return false
    });
};