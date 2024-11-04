const express = require('express');
const router = express.Router();
const logs = require('../controllers/logs');
const authenticate = require('../services/authenticate')
const jwt = require('../services/jwt');

router.get('/', authenticate.authenticateToken, async function(req, res, next) {
    console.log("logs.js")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const decode = jwt.verifyAccessToken(token)
    console.log(decode.data.uuid)
    try {
      let where_clause = ' to_uuid = "'+ decode.data.uuid +'" AND (command = "viewed" OR command = "viewed")'
      let order_by_clause = ''
      res.status(200).json(await logs.getLogs(where_clause,  order_by_clause));
      return
    } catch (err) {
      console.error(`Error while getting notifications`, err.message);
      next(err);
    }
});

module.exports = router;