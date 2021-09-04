const config = require('../config');
const { userModel } = require('../models');

config.db.driver.Promise = global.Promise;

const database = {};

database.mongoose = config.db.driver;

database.url = config.db.url;

database.models = {
    userModel: userModel(config.db.driver)
};

module.exports = database;