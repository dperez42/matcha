const express = require('express');
const router = express.Router();
const jwt = require('../services/jwt')
//const jwt = require('jsonwebtoken');
const socket_list = require('../sockets/socket_list')
var SocketSingleton = require('../sockets/socket');
const email = require('../services/email')

/// ------ when click in link in email register user
router.get('/:key', function(req, res, next) {
  // try {
  //   console.log("result", jwt.readToken(req.params.key), req.params.key)

  //     res.json("Not zok" + jwt.readToken(req.params.key))
  // } catch (err) {
  //     console.error(`Error while creating user`, err.message);
  //     next(err);
  //   }
  //SocketSingleton.io.emit('chat1', {msg: 'success!'});
  jwt.verify(req.params.key, process.env.TOKEN_SECRET, (err, data) => {
    //console.log(req.params.key)
    if (err) {
        //console.log("error", err.message)
        res.json("ERROR: "+err.message +" try again localhost:8000"+ socket_list.STATIC_CONNECTIONS)
        return (err.message)
    }
    //console.log("Data", data)  
    var i = socket_list.STATIC_CONNECTIONS.indexOf(data.socketId)
    if (i===-1){
      res.json("No socket connect Data: " + data.socketId + " vs "+ socket_list.STATIC_CONNECTIONS )
      //create user
    } else {
      res.json("socket connect Data: " + data.socketId + " vs "+  socket_list.STATIC_CONNECTIONS )
      //create user 
      //send via socket userdata and redirect to profile and jwt 
      SocketSingleton.io.emit('verification', {msg: 'success2!'});
    }
    return (data)    
    //return(true)
    //next()
    })
});

/// ------- create link an send a confirm email, in the token store: email, password, username, first, last, socketid

router.post('/', async function(req, res, next) {
  try {
    // Check si existe el usuario
    //console.log("jjjjj:", req.body.email)
    //Genero un JWT with users data
    const token = jwt.generateAccessToken({
        "email":req.body.email, 
        "password":req.body.password, 
        "username":req.body.username, 
        "first":req.body.first,
        "last":req.body.last,
        "socketId":req.body.socketId});
    //console.log("accestoken email:", token)
    //console.log("jjjjj:", req.body.email)
    //Send email with jwt
    const email_result = email.send(req.body.email,token)
    //console.log(email_result)
    //users.create(req.data)
    res.status(200).json({requestBody: req.body});
    //res.json(await users.create(req.body));
  } catch (err) {
    console.error(`Error while sending verification email`, err.message);
    next(err);
  }
});


module.exports = router;