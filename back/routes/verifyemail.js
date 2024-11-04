const express = require('express');
const router = express.Router();
const jwt = require('../services/jwt')
//const jwt = require('jsonwebtoken');
const socket_list = require('../sockets/socket_list')
var SocketSingleton = require('../sockets/socket');
const email = require('../services/email')
const users = require('../controllers/users');

router.get('/', async function(req, res, next) {
    console.log(req.query.token)
    const authHeader = req.query.token
    if (!authHeader) {
      return res.sendStatus(401); // no tiene credenciales
    }
    const result = jwt.verifyAccessToken(authHeader);
    if (!result.success) {
      return res.status(403).json({ error: result.error }); // no autorizado
    }
    try {
      console.log(result.data)   //  user_data, token and iat y exp
      // Send messsage to socket: User_data(uuid,...) and new jwtwebtoken
      console.log(result.data.socket)
      const result1 = await users.create(result.data.user)
      const result2 = await  users.getOnes('email="'+result.data.user.email+'"')
      await new Promise(resolve => setTimeout(resolve, 100)); //just a dealy to finish insert
      //Genero un JWT
      const token = jwt.generateAccessToken({"uuid": result2[0].uuid});
      console.log("UUUID",result2[0].uuid)
      const msg = { 
        //msg: "your email have been verificated",
        //data: result2, 
        token: token,
        socket: result.data.socket
      }
      // send message via sokcet to unfreeze register page
      SocketSingleton.io.to(result.data.socket).emit('verification',msg)
      res.status(200).json('Email verificated go to Matcha App');
      //res.json(await users.create(req.body));
    } catch (err) {
      console.error('Error while sending password reset', err.message);
      next(err);
    }
});
   
  module.exports = router;