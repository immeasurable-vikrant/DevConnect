const express = require('express')
const userAuth = require('../middlewares/auth');

const requestRouter = express.Router();


requestRouter.post('/sendConnectionRequest', userAuth, (req, res) => {
    res.send('request route')
})

module.exports = requestRouter;