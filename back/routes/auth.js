// Endpoint to check token from app

const express = require('express');
const router = express.Router();
const jwt2 = require('../services/jwt')
const jwt = require('jsonwebtoken');
const socket_list = require('../sockets/socket_list')
var SocketSingleton = require('../sockets/socket');

/// when click in link in email register user
router.get('/', function(req, res, next) {
  const token = req.query.key
  jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, data) => {
    if (err) {
      if (process.env.DEBUG==='true'){console.log("error auth.js:", err)};
      res.status(200).json({"status":'Unauthorized', "msg":err.message})
      return (err.message)
    }
    if(data.iat === undefined){
      if (process.env.DEBUG==='true'){console.log("info auth.js:", data)};
      res.status(200).json({"status":'Unauthorized', "msg":data}) 
    } else {
      //renew token, send new one
      if (process.env.DEBUG==='true'){console.log("info auth.js: renew token")};
      const new_token = jwt2.generateAccessToken({"uuid":data.uuid})
      //const new_token = "kk"
      //const jwt_token = jwt.HH:mm:ssn({"user_uuid": def_user.uuid})
      res.status(200).json({"status":'Authorized', "msg":data, "renew_token":new_token})
      
    }
  })
});

router.post('/', async function(req, res, next) {
  try {
    //Genero un JWT
    const token = jwt.generateAccessToken({email:req.body.email, password:req.body.password, username:req.body.username, first:req.body.first, last:req.body.last, socketId:req.body.socketId});
    if (process.env.DEBUG==='true'){console.log("info auth.js:",req.data)};
    users.create(req.data)
    res.status(200).json({requestBody: req.body});
  } catch (err) {
    if (process.env.DEBUG==='true'){console.log("error auth.js:",err.message)};
    next(err);
  }
});


module.exports = router;