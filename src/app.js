require('dotenv').config()
require("./configs/database").connect();
const express = require('express');
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
require('./routes/auth')(app);

app.get('/', (req, res) => {
	res.json({'response': 'Hello world'})
});

module.exports = app;