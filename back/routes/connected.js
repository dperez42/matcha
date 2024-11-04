const express = require('express');
const router = express.Router();
const notifications = require('../controllers/notifications');
const authenticate = require('../services/authenticate')
const jwt = require('../services/jwt');
const user_socket_list = require('../sockets/user_socket_list')

//router.get('/', authenticate.authenticateToken, async function(req, res, next) {
router.get('/', async function(req, res, next) {
    console.log("connected.js")
    const socket_list = user_socket_list.get()
    res.status(200).json(socket_list);
    return
});

module.exports = router;