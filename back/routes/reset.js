const express = require('express');
const router = express.Router();
const jwt = require('../services/jwt')
const users = require('../controllers/users')
//const jwt = require('jsonwebtoken');
const socket_list = require('../sockets/socket_list')
var SocketSingleton = require('../sockets/socket');
const email = require('../services/email')

router.post('/', async function(req, res, next) {
    
    try {
      // Check si existe el usuario
      //console.log("jjjjj:", req.body.email)
      //
      const user = await users.getOnes(' email = "'+req.body.email+'"','');
      //console.log("rest", user)
      //Genero un JWT with users data
      const token = jwt.generateAccessToken({
          "uuid":user[0].uuid,
        });
      //console.log("accestoken email:", token)
      //console.log("jjjjj:", req.body.email)
      //Send email to user email with jwt authorized
      const email_result = email.sendReset(req.body.email,token)
      //console.log(email_result)
      //users.create(req.data)
      res.status(200).json({requestBody: req.body});
      //res.json(await users.create(req.body));
    } catch (err) {
      //console.error('Error while sending password reset', err.message);
      next(err);
    }
});
   
  module.exports = router;