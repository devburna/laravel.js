const express = require('express');

const middleware = require('../middleware');
const AuthController = require('../controllers/auth-controller');

const router = express.Router();

router.use(function timelog(_, _, next) {
    console.info('Time: ', Date.now());
    next();
});

router.get('/', (_, res) => {
    res.status(200).send({ status: true, message: 'Server is active!' });
});

router.post('/register', AuthController.register);

router.post('/verify', AuthController.verify);

router.post('/login', AuthController.login);

router.post('/recover', AuthController.recover);

router.post('/reset', AuthController.reset);

router.get('/user', middleware.auth, AuthController.user);

module.exports = router;