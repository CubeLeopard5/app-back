require('dotenv').config()
require("./configs/database").connect();

const express = require('express');

const session = require('express-session');
exports.session = session;

const passport = require('passport');

const cors = require('cors');
const birds = require('./routes/birds');

const app = express();
const bodyParser = require('body-parser');
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse the raw data
app.use(bodyParser.raw());
// parse text
app.use(bodyParser.text());
app.use('/birds', birds);
app.use(cors());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
}));

app.use(passport.initialize());

require('./routes/auth')(app);
require("./strategies/reddit.js")(app);
require('./routes/reddit')(app);

app.get('/', (req, res) => {
	res.json({'response': 'Hello world'})
});

module.exports = app;