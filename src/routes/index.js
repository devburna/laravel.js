const express = require('express');

const middleware = require('../middleware');
const { registerController, verifyController, loginController, recoverController, resetController, userController } = require('../controllers');

const router = express.Router();

router.use(function timelog(_, _, next) {
    console.info('Time: ', Date.now());
    next();
});

router.get('/', (_, res) => {
    res.status(200).send({ status: true, message: 'Server is active!' });
});

router.post('/register', registerController.index);

router.post('/verify', verifyController.index);

router.post('/login', loginController.index);

router.post('/recover', recoverController.index);

router.post('/reset', resetController.index);

router.get('/user', middleware.auth, userController.index);

module.exports = router;