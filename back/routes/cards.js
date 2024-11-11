const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const jwt = require('../services/jwt');
const email = require('../services/email')
const authenticate = require('../services/authenticate')


router.post('/', authenticate.authenticateToken, async function(req, res, next) {
  try {
    let select_clause = req.body.select_clause
    let where_clause = req.body.where_clause
    let order_clause = req.body.order_clause + ' LIMIT '+req.body.limit+ ' OFFSET ' + req.body.page*req.body.limit
    let user_uuid =  req.body.user_uuid
    //console.log("order:" ,order_clause)
    res.status(200).json(await users.getCards(where_clause,  order_clause, select_clause, user_uuid,req.body.limit_tags));
    return
  } catch (err) {
    //console.error(`Error while getting users`, err.message);
    next(err);
  }
});

module.exports = router;