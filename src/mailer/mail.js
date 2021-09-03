const nodemailer = require('nodemailer');
const path = require('path');

var hbs = require('nodemailer-express-handlebars');

const config = require('../config');

const mail = nodemailer.createTransport(config.mail);

mail.use('compile', hbs({
    viewEngine: {
        extName: ".hbs",
        partialsDir: path.resolve(__dirname, "../resources/views/emails"),
        defaultLayout: false
    },
    viewPath: path.resolve(__dirname, "../resources/views/emails"),
    extName: ".hbs"
}));

module.exports = mail;