const express = require('express');
const cors = require('cors');

const config = require('./config');
const db = require('./database');
const routes = require('./routes');

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors({
    credentials: true
}));

app.use(require('cookie-parser')());

app.use(require('express-session')({
    secret: config.app.key,
    resave: true,
    saveUninitialized: true
}));

app.use(routes);

db.mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to the database!');

    app.listen(config.app.port, () => {
        console.log(`Server is running on ${config.app.url}:${config.app.port}`);
    });
}).catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
});