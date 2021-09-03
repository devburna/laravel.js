<<<<<<< Updated upstream
module.exports = {
    mongodb: require("./mongo"),
    mysqldb: require("./mysql")
}
=======
const config = require('../config');
const UserModel = require('../models/user-model');

config.db.driver.Promise = global.Promise;

const database = {};

database.mongoose = config.db.driver;

database.url = config.db.url;

database.models = {
    user: UserModel(config.db.driver)
};

module.exports = database;
>>>>>>> Stashed changes
