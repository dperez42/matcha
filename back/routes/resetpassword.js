const express = require('express');
const router = express.Router();
const myjwt = require('../services/jwt')
const socket_list = require('../sockets/socket_list')
var SocketSingleton = require('../sockets/socket');
const authenticate = require('../services/authenticate')
const users = require('../controllers/users');

router.post('/', authenticate.authenticateToken, async function(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
 
  //console.log(token)
  var decode = myjwt.verifyAccessToken(token)
  console.log("uuid:", decode.data.uuid)
  console.log("password:", req.body.password)
  try {
    // Here change password
    var data = {
      uuid: decode.data.uuid,
      password: req.body.password
    }
    var result = users.updatePassword(data)
    res.status(200).json({'data': result});
  } catch (err) {
      console.error('Error while resetting password', err.message);
      next(err);
    }
});
   
module.exports = router;