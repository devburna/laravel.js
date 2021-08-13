const express = require("express");
const cors = require("cors");
require("dotenv").config()

const { app } = require("./config");
const { mongodb } = require("./database");
const routes = require("./routes");

// server
const server = express();

// for parsing application/json
server.use(express.json());

// for parsing application/xwww-
server.use(express.urlencoded({ extended: true }));

// use cors
server.use(cors({
    credentials: true,
}));

server.use(require("cookie-parser")());
server.use(require("express-session")({ secret: "keyboard cat", resave: true, saveUninitialized: true }));

server.use(routes);

mongodb.mongoose
    .connect(mongodb.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true
    })
    .then(() => {
        console.log("Connected to the database!");

        // start server
        server.listen(app.port, () => {
            console.log(`Server is running on ${app.url}:${app.port}`);
        })
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });