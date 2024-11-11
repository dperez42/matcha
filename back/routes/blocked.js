const express = require('express');
const router = express.Router();
const blocked = require('../controllers/blocked');
const authenticate = require('../services/authenticate')
const jwt = require('../services/jwt');

router.get('/', authenticate.authenticateToken, async function(req, res, next) {
    //console.log("blocked.js")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const decode = jwt.verifyAccessToken(token)
    //console.log(decode.data.uuid)
    try {
      let where_clause = ' from_uuid = "'+ decode.data.uuid +'"'
      let order_by_clause = ''
      res.status(200).json(await blocked.getOnes(where_clause,  order_by_clause));
      return
    } catch (err) {
      //console.error(`Error while getting notifications`, err.message);
      next(err);
    }
});
// insert notifications in historic and tmp table not read
router.post('/', authenticate.authenticateToken,async function(req, res, next) {
  try {
    //console.log("create notifications:", req.body)
    var result = notifications.create(req.body)
    await new Promise(resolve => setTimeout(resolve, 100)); //just a delay to finish insert
    res.status(200).json({'data': result});
  } catch (err) {
    //console.error(`Error while register`, err.message);
    next(err);
  }
});
// delete notifications not read by uuid
router.delete('/', authenticate.authenticateToken, async function(req, res, next) {
  //console.log("notifications.js")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const decode = jwt.verifyAccessToken(token)
   // console.log(decode.data.uuid)
  try {
    res.json(await notifications.remove(decode.data.uuid));
  } catch (err) {
    //console.error(`Error while deleting user`, err.message);
    next(err);
  }
});

module.exports = router;