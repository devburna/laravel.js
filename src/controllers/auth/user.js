module.exports = {
    main: function (req, res) {

        const { name, email, emailVerifiedAt, createdAt } = req.user.user;

        return res.status(200).send({
            status: true,
            data: {
                name: name,
                email: email,
                emailVerifiedAt: emailVerifiedAt,
                createdAt: createdAt,
            },
            message: "Authenticated!"
        });
    }
}