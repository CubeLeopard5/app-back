require('dotenv').config()
require("./configs/database").connect();
const express = require('express');
const cors = require('cors');
const birds = require('./routes/birds');

const app = express();

app.use('/birds', birds);
app.use(cors());

app.get('/', (req, res) => {
	res.json({'response': 'Hello world'})
});

module.exports = app;