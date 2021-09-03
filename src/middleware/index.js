var jwt = require('jsonwebtoken');

const config = require('../config');

module.exports = {
    auth: (req, res, next) => {
        var token = req.headers['authorization'];

        if (token) {

            var token = token.replace(/^Bearer\s+/, "");

            jwt.verify(token, config.app.key, (err, decoded) => {
                if (err) {
                    return res.status(401).send({
                        status: false,
                        message: 'Unauthenticated.'
                    });
                }
                req.user = decoded.user;

                next();
            });
        } else {
            return res.status(400).send({
                status: false,
                message: 'Missing bearer token.'
            });
        }
    },
};