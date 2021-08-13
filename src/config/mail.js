const nodemailer = require("nodemailer");
const path = require("path");
var hbs = require("nodemailer-express-handlebars");

const mail = nodemailer.createTransport({
    transport: 'smtp',
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    encryption: process.env.MAIL_ENCRYPTION,
    secure: process.env.MAIL_SECURE || false,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    },
    tls: {
        ciphers: 'SSLv3'
    }
});

mail.use('compile', hbs({
    viewEngine: {
        extName: ".hbs",
        partialsDir: path.resolve(__dirname, "../views/emails"),
        defaultLayout: false
    },
    viewPath: path.resolve(__dirname, "../views/emails"),
    extName: ".hbs"
}));

module.exports = mail;