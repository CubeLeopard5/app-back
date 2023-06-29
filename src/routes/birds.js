const express = require('express')
const router = express.Router()
const auth = require("../middelwares/auth");
const cors = require('cors');
router.use(cors());

router.use((req, res, next) => {
	auth(req, res, next);
})

router.get('/', (req, res) => {
    res.status(200).send('Birds home page')
})

router.get('/about', (req, res) => {
    res.send('About birds')
})

module.exports = router