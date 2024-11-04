const express = require('express');
const router = express.Router();
const jwt = require('../services/jwt')
const users = require('../controllers/users');
//const jwt = require('jsonwebtoken');
const socket_list = require('../sockets/socket_list')
var SocketSingleton = require('../sockets/socket');
const email = require('../services/email')

/// ------ when click in link in email register user
router.get('/', async function(req, res, next) {
  console.log(req.query.token)
  const para = req.query.token
  // check if there a token
  if (!para){
    console.log("error")
  }
  // check is a valid token
  const verify = jwt.verifyAccessToken(para) 
  //console.log(verify)
  if (verify.success === false){
    res.status(400).json(verify.error)
  }
  if (verify.success === true)
  {
  //register usr user
  console.log(verify.data.user)
  var new_uuid = ''
  ///////check user exits?
  try {
    console.log("register:", verify.data.user)
    const result2 = await users.getOnes('email="'+verify.data.user.email+'"')
    console.log(result2.length)
    if (result2.length > 0){
      console.log("user exits with uuid:", result2[0].uuid)
      // send message by socket with new token(uuid)
      //SocketSingleton.io.emit('verification', {msg: 'fail!'});
      SocketSingleton.io.to(verify.data.socket).emit('verification', {msg: 'fail!'});
      res.status(400).json({'msg': 'user exits'});
      return false
    }    
  } catch (err) {
    console.error(`Error while register`, err.message);
    next(err);
  }
  //register user and get uuid
    try {
      console.log("register:", verify.data.user)
      var result = await users.create(verify.data.user)
      await new Promise(resolve => setTimeout(resolve, 500)); //just a dealy to finish insert
      const result2 = await users.getOnes('email="'+verify.data.user.email+'"')
      await new Promise(resolve => setTimeout(resolve, 500)); //just a dealy to finish insert
      console.log("user create with uuid:", result2[0].uuid)
      new_uuid = result2[0].uuid
      //Genero un nuevo token valido y se lo mando en el response
      //const new_token = jwt.generateAccessToken({"uuid": result2[0].uuid});
      //res.status(200).json({'data': result2[0], 'token': token});
    } catch (err) {
      console.error(`Error while register`, err.message);
      next(err);
    }
    
    // create a token with uuid
    const new_token = jwt.generateAccessToken({"uuid": new_uuid});

    // send message by socket with new token(uuid)
    //SocketSingleton.io.emit('verification', {msg: 'success!', token: new_token});
    SocketSingleton.io.to(verify.data.socket).emit('verification', {msg: 'success!', token: new_token});
    res.status(200).json(verify) //send  a html page
    return true
  }
  
});

/// ------- create link an send a confirm email, in the token store: email, password, username, first, last, socketid

router.post('/', async function(req, res, next) {
  try {
    // Check si existe el usuario
    console.log("jjjjj:", req.body.email)
    //Genero un JWT with users data
    const token = jwt.generateAccessToken({
        "email":req.body.email, 
        "password":req.body.password, 
        "username":req.body.username, 
        "first":req.body.first,
        "last":req.body.last,
        "socketId":req.body.socketId});
    console.log("accestoken email:", token)
    console.log("jjjjj:", req.body.email)
    //Send email with jwt
    const email_result = email.send(req.body.email,token)
    console.log(email_result)
    //users.create(req.data)
    res.status(200).json({requestBody: req.body});
    //res.json(await users.create(req.body));
  } catch (err) {
    console.error(`Error while sending verification email`, err.message);
    next(err);
  }
});

module.exports = router;