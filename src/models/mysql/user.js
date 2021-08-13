module.exports = (sequelize, DataTypes) => {
    try {
        console.log(Datatypes);
        const User = sequelize.define("user", {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
            name: {
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING
            },
            emailVerifiedAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            password: { type: Sequelize.STRING },
            timestamps: true
        });

        console.log(User === sequelize.models.User);
        return User;

    } catch (error) {
        console.log(error.message);
        return error
    }
};