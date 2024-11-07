const express = require('express');
const router = express.Router();
const jwt = require('../services/jwt')
//const jwt = require('jsonwebtoken');
const socket_list = require('../sockets/socket_list')
var SocketSingleton = require('../sockets/socket');
const email = require('../services/email')

router.post('/', async function(req, res, next) {
  console.log(req.body)
    try {
      //Genero un JWT with users data and socketId
      const jwttoken = jwt.generateAccessToken({
          "user": req.body.user_data,
          "socket": req.body.user_socket
      });
      //Send email to user email with jwt authorized
      const email_result = email.sendLink(req.body.user_data.email,req.body.user_data.username,jwttoken)
      if (email_result.responseCode > 299){
        res.status(email_result.responseCode).json({"msg":email_result.response});
       } else {
        res.json({"result":"success"});
       }
      //users.create(req.data)
      //res.status(200).json({requestBody: jwttoken});
    } catch (err) {
      console.error('Error while sending password reset', err.message);
      next(err);
    }
});
   
  module.exports = router;