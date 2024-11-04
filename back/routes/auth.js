// Endpoint to check token from app

const express = require('express');
const router = express.Router();
const jwt2 = require('../services/jwt')
const jwt = require('jsonwebtoken');
const socket_list = require('../sockets/socket_list')
var SocketSingleton = require('../sockets/socket');

/// when click in link in email register user
router.get('/', function(req, res, next) {
  // try {
  //   console.log("result", jwt.readToken(req.params.key), req.params.key)

  //     res.json("Not zok" + jwt.readToken(req.params.key))
  // } catch (err) {
  //     console.error(`Error while creating user`, err.message);
  //     next(err);
  //   }
  //SocketSingleton.io.emit('chat1', {msg: 'success!'});
  console.log("HERE", req.query.key)
  const token = req.query.key
  jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, data) => {
    if (err) {
        console.log("error", err)
        res.status(200).json({"status":'Unauthorized', "msg":err.message})
        return (err.message)
    }
    if(data.iat === undefined){
      res.status(200).json({"status":'Unauthorized', "msg":data}) 
    } else {
      console.log("jwt", err)
      //renew token, send new one
      const new_token = jwt2.generateAccessToken({"uuid":data.uuid})
      //const new_token = "kk"
      //const jwt_token = jwt.HH:mm:ssn({"user_uuid": def_user.uuid})
      res.status(200).json({"status":'Authorized', "msg":data, "renew_token":new_token})
      
    }
  })
});

/// create link an send confirm email, in the token store: email, password, username, first, last, socketid

router.post('/', async function(req, res, next) {
  try {
    // Check si existe el usuario
    console.log("jjjjj:", req.body)
    //Genero un JWT
    const token = jwt.generateAccessToken({email:req.body.email, password:req.body.password, username:req.body.username, first:req.body.first, last:req.body.last, socketId:req.body.socketId});
    console.log("accestoken:", token)
    //Send email with jwt
    //email.send(req.body.email,token)

    users.create(req.data)
    res.status(200).json({requestBody: req.body});
    //res.json(await users.create(req.body));
  } catch (err) {
    console.error(`Error while sending verification email`, err.message);
    next(err);
  }
});


module.exports = router;