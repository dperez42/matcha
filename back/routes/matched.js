const express = require('express');
const router = express.Router();
const matched = require('../controllers/matched');
const authenticate = require('../services/authenticate')
const jwt = require('../services/jwt');

router.get('/', authenticate.authenticateToken, async function(req, res, next) {
    console.log("matched.js")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const decode = jwt.verifyAccessToken(token)
    //console.log(decode.data.uuid)
    try {
      let where_clause = ' from_uuid = "'+ decode.data.uuid +
        '" OR to_uuid = "'+ decode.data.uuid +'"'
      //console.log(where_clause)
      let order_by_clause = ''
      res.status(200).json(await matched.getOnes(where_clause,  order_by_clause));
      return
    } catch (err) {
      console.error(`Error while getting notifications`, err.message);
      next(err);
    }
});


module.exports = router;