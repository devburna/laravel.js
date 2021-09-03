const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const config = {};

config.app = {
    name: process.env.APP_NAME,
    key: process.env.APP_KEY,
    url: process.env.APP_URL,
    port: process.env.APP_PORT,
    timezone: process.env.APP_TIMEZONE
};

config.db = {
    driver: mongoose,
    url: process.env.DB_URL || 'mongodb://localhost:27017/space'
};

config.mail = {
    transport: process.env.MAIL_DRIVER,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    encryption: process.env.MAIL_ENCRYPTION,
    secure: process.env.MAIL_SECURE || false,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    },
    from: {
        address: process.env.MAIL_FROM_ADDRESS,
        name: process.env.MAIL_FROM_NAME
    },
    tls: {
        ciphers: 'SSLv3'
    }
};


module.exports = config;