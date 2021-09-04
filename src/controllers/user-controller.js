module.exports = {
    index: (req, res) => {

        res.status(200).send({
            status: true,
            message: 'Authenticated.',
            data: {
                id: req.user.id,
                avatar: req.user.avatar,
                username: req.user.username,
                email: req.user.email,
                emailVerifiedAt: req.user.emailVerifiedAt,
                createdAt: req.user.createdAt
            }
        });
    }
};