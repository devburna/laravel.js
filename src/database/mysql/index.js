const { database } = require("../../config");
const { user } = require("../../models");

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(database.connections.mysql.database, database.connections.mysql.username, database.connections.mysql.password, {
    host: database.connections.mysql.host,
    dialect: database.connections.mysql.driver,
});

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    models: {
        user: user(sequelize, DataTypes),
        // more model here...
    }
};