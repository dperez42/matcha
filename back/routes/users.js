const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const jwt = require('../services/jwt');
const email = require('../services/email')
const authenticate = require('../services/authenticate')

//create a unique get with query 
router.get('/', async function(req, res, next) {
  //console.log("all",Object.keys(req.query).length)
  //console.log("params",req)
    // create where clausule
    let where_clause = ''
    if(req.query.username != undefined){
      where_clause = ' username = "' + req.query.username + '"'
    } 
    if(req.query.email != undefined){
      if (where_clause === '') {
        where_clause = ' email = "' + req.query.email + '"'
      } else {
        where_clause = where_clause + ' and email = "' + req.query.email + '"'
      }
    } 
    if(req.query.uuid != undefined){
      if (where_clause === '') {
        where_clause = ' uuid = "' + req.query.uuid + '"'
      } else {
        where_clause = where_clause + ' and uuid = "' + req.query.uuid + '"'
      }
    }
    /* resto filtros age, location, fame ratings*/
    // create order by clausule
    let order_by_clause = ''
    if(req.query.ord != undefined){
        order_by_clause =  req.query.ord 
      if(req.query.ordtype != undefined && (req.query.ordtype === 'DESC' ||req.query.ordtype === 'ASC')){
        order_by_clause =  order_by_clause + ' ' + req.query.ordtype
      } 
    }
    //console.log(where_clause)
    try {
      res.json(await users.getOnes(where_clause,  order_by_clause));
      return
    } catch (err) {
      //console.error(`Error while getting users`, err.message);
      next(err);
    }
});

//register 
router.post('/', async function(req, res, next) {
    try {
      //onsole.log("register:", req.body)
      var result = await users.create(req.body)
      await new Promise(resolve => setTimeout(resolve, 500)); //just a dealy to finish insert
      const result2 = await users.getOnes('email="'+req.body.email+'"')
      await new Promise(resolve => setTimeout(resolve, 500)); //just a dealy to finish insert
      //console.log("user create with uuid:", result2[0].uuid)
      //Genero un nuevo token valido y se lo mando en el response
      const token = jwt.generateAccessToken({"uuid": result2[0].uuid});
      res.status(200).json({'data': result2[0], 'token': token});
    } catch (err) {
      //console.error(`Error while register`, err.message);
      next(err);
    }
  });
//update
router.put('/', authenticate.authenticateToken, async function(req, res, next) {
  //console.log("check routes")
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const decode = jwt.verifyAccessToken(token)
  const uuid = decode.data.uuid
  if (!token) {
    return res.sendStatus(401); // no tiene credenciales
  }
  const result = jwt.verifyAccessToken(token);
  if (!result.success) {
    return res.status(403).json({ error: result.error }); // no autorizado
  }
  //res.status(200).json({ uuid: uuid, user: req.body});
  //console.log("check body:",req.body)
  try {
    res.status(200).json(await users.updateProfile(uuid, req.body));
  } catch (err) {
    //console.error(`Error while updating profile`, err.message);
    next(err); 
  }
  
  });

router.delete('/:uuid', async function(req, res, next) {
    try {
      res.json(await users.remove(req.params.uuid));
    } catch (err) {
      //console.error(`Error while deleting user`, err.message);
      next(err);
    }
  });

module.exports = router;