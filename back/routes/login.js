const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const jwt = require('../services/jwt');
const email = require('../services/email');
const bcrypt = require('../services/bcrypt');
const user_socket_list = require('../sockets/user_socket_list')

router.get('/', async function(req, res, next) {
  //console.log("all",Object.keys(req.query).length)
  console.log('login.js: ',req.query.username, '---', req.query.password)
    // create where clausule
    let where_clause = ''
    if(req.query.username != undefined){
        where_clause = ' username = "' + req.query.username + '"'
    }
    let order_by_clause = ''
    try {
        let result = await users.getOnes(where_clause,  order_by_clause)
        console.log(result)
        if (result.length === 0){
          res.status(401).json({'msg': 'Username not found'}); //no user with this username
          return
        }
        // Compare passwords
        let check = await bcrypt.comparePassword(req.query.password, result[0].password)
        if (check){
          //send a valid and new token etc....
          //Genero un JWT
          const token = jwt.generateAccessToken({"uuid":result[0].uuid});  //generate a new token with uuid
          const socket = req.headers['socket']
          console.log("User confirmed: uuid:", result[0].uuid, "accestoken:", token, " socket", socket)
          // load socket in user_socker_list
          user_socket_list.add([result[0].uuid,socket]);
          const result2 = {'data':result[0],
                            'token': token}
          res.status(200).json(result2);
          return
        } else {
          res.status(401).json({'msg': 'Wrong password'}); //wrong password
          return
        }
      } catch (err) {
        console.error(`Error while getting users`, err.message);
        next(err);
      }
});

router.post('/', async function(req, res, next) {
  //console.log("all",Object.keys(req.query).length)
  console.log('login.js: ',req.body.username, '---', req.body.password)
    // create where clausule
    let where_clause = ''
    if(req.body.username != undefined){
        where_clause = ' username = "' + req.body.username + '"'
    }
    let order_by_clause = ''
    try {
        let result = await users.getOnes(where_clause,  order_by_clause)
        console.log(result)
        if (result.length === 0){
          res.status(401).json({'msg': 'Username not found'}); //no user with this username
          return
        }
        // Compare passwords
        let check = await bcrypt.comparePassword(req.body.password, result[0].password)
        if (check){
          //send a valid and new token etc....
          //Genero un JWT
          const token = jwt.generateAccessToken({"uuid":result[0].uuid});  //generate a new token with uuid
          const socket = req.headers['socket']
          console.log("User confirmed: uuid:", result[0].uuid, "accestoken:", token, " socket", socket)
          // load socket in user_socker_list
          user_socket_list.add([result[0].uuid,socket]);
          const result2 = {'data':result[0],
                            'token': token}
          res.status(200).json(result2);
          return
        } else {
          res.status(401).json({'msg': 'Wrong password'}); //wrong password
          return
        }
      } catch (err) {
        console.error(`Error while getting users`, err.message);
        next(err);
      }
});
module.exports = router;