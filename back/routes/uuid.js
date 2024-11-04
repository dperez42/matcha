const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const jwt = require('../services/jwt');
const email = require('../services/email')
const authenticate = require('../services/authenticate')
/* GET programming languages. */
// router.get('/', async function(req, res, next) {
//   try {
//     res.json(await users.getMultiple(req.query.page));
//   } catch (err) {
//     console.error(`Error while getting programming languages `, err.message);
//     next(err);
//   }
// });

//create a unique get with query 
router.get('/', authenticate.authenticateToken, async function(req, res, next) {
  console.log("uuid.js")
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const decode = jwt.verifyAccessToken(token)
  console.log(decode.data.user_uuid)
  try {
    let where_clause = ' uuid = "'+ decode.data.uuid +'"'
    let order_by_clause = ''
    res.status(200).json(await users.getOnes(where_clause,  order_by_clause));
    return
  } catch (err) {
    console.error(`Error while getting users`, err.message);
    next(err);
  }
});

module.exports = router;