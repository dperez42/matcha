const express = require('express');
const router = express.Router();
const jwt = require('../services/jwt')
//const jwt = require('jsonwebtoken');
const socket_list = require('../sockets/socket_list')
var SocketSingleton = require('../sockets/socket');
const email = require('../services/email')

/// ------- create link an send a confirm email, in the token store: email, password, username, first, last, socketid

router.post('/', async function(req, res, next) {
  //console.log(req.body)
  try {
    const email_result = await email.sendCode(req.body.email, req.body.username, req.body.code)
    if (email_result.responseCode > 299){
     res.status(email_result.responseCode).json({"msg":email_result.response});
    } else {
      res.json({"result":"success"});
    }
  } catch (err) {
    console.error(`Error while sending verification code email`, err.message);
    next(err);
  }
});


module.exports = router;