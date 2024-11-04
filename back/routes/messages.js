const express = require('express');
const router = express.Router();
const messages = require('../controllers/messages');
const jwt = require('../services/jwt');
const email = require('../services/email')
const authenticate = require('../services/authenticate')
/* GET programming languages. */
// router.get('/', async function(req, res, next) {
//   try {
//     res.json(await users.getMultiple(req.query.page));
//   } catch (err) {
//     console.error(`Error while getting programming languages `, err.message);
//     next(err);
//   }
// });

//create a unique get with query 
router.get('/', async function(req, res, next) {
  //console.log("all",Object.keys(req.query).length)
  //console.log("params",req)
    
    // create where clausule
    let where_clause = ''
    const uuid1 = req.query.uuid1
    const uuid2 = req.query.uuid2
    //if(req.query.username != undefined){
      where_clause = ' (from_uuid = "' + uuid1 + '" AND to_uuid = "'+ uuid2 + '" ) \
        OR (from_uuid = "' + uuid2 + '" AND to_uuid = "'+ uuid1 + '" )'
    //} 
    try {
      //res.json({"msg":where_clause})
      res.json(await messages.getMessages(where_clause));
      return
    } catch (err) {
      console.error(`Error while getting users`, err.message);
      next(err);
    }
});
/*
//register 
router.post('/', async function(req, res, next) {
    try {
      //console.log("register:", req.body)
      var result = users.create(req.body)
      const result2 = users.getOnes('email="'+req.body.email+'"')
      await new Promise(resolve => setTimeout(resolve, 100)); //just a dealy to finish insert
      //Genero un JWT
      const token = jwt.generateAccessToken({"user_uuid": result2.uuid});
      res.status(200).json({'data': result2, 'token': token});
    } catch (err) {
      console.error(`Error while register`, err.message);
      next(err);
    }
  });
//update
router.put('/', authenticate.authenticateToken, async function(req, res, next) {
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
  
  try {
    res.status(200).json(await users.updateProfile(uuid, req.body));
  } catch (err) {
    console.error(`Error while updating profile`, err.message);
    next(err); 
  }
  
  });

router.delete('/:uuid', async function(req, res, next) {
    try {
      res.json(await users.remove(req.params.uuid));
    } catch (err) {
      console.error(`Error while deleting user`, err.message);
      next(err);
    }
  });
*/
module.exports = router;