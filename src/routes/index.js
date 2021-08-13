const express = require("express");
const router = express.Router();

const { authentication } = require("../controllers");
const { auth } = require("../middleware");

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.info('Time: ', Date.now());
    next();
})

router.get("/", (_, res) => {
    res.send(`Online on ${new Date()}`);
});

router.post("/signup", authentication.register.main);

router.post("/signin", authentication.login.main);

router.get("/user", auth, authentication.user.main);

router.post("/verify", authentication.verification.verify);

module.exports = router;