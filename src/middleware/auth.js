const jwt = require("jsonwebtoken");
const { app } = require("../config");

module.exports = (req, res, next) => {
    const token = req.headers["authorization"];

    if (token) {

        const newToken = token.replace(/^Bearer\s+/, "");

        jwt.verify(newToken, app.key, (err, decoded) => {
            if (err) {
                return res.status(403).send({
                    status: false,
                    data: {},
                    message: "Unauthenticated!"
                });
            }
            req.user = decoded;
            next();
        });
    } else {
        return res.status(401).send({
            status: false,
            data: {},
            message: "Invalid Token!"
        });
    }
}