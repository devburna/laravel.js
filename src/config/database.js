module.exports = {
    connections: {
        mysql: {
            driver: 'mysql',
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_DATABASE,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD
        },
        mongo: {
            driver: require("mongoose"),
            url: process.env.MONGODB_URL || 'mongodb://localhost:27017/local'
        }
    }
}