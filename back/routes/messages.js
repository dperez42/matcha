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
      //console.error(`Error while getting users`, err.message);
      next(err);
    }
});

module.exports = router;