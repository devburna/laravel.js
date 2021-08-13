const { database } = require("../../config");
const { user } = require("../../models");

database.connections.mongo.driver.Promise = global.Promise;

const models = {
    user: user(database.connections.mongo.driver),
    // more model here...
}

module.exports = {
    mongoose: database.connections.mongo.driver,
    url: database.connections.mongo.url,
    models: models
};