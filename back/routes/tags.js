const express = require('express');
const router = express.Router();
const tags = require('../controllers/tags');
const authenticate = require('../services/authenticate')
const jwt = require('../services/jwt');

//get 
router.get('/', authenticate.authenticateToken, async function(req, res, next) {
    console.log("tags.js")
    console.log(req.query.uuid)
    try {
      res.json(await tags.get(req.query.uuid));
    } catch (err) {
      console.error(`Error while gettting tags`, err.message);
      next(err);
    }
});
//add
router.post('/', authenticate.authenticateToken, async function(req, res, next) {
  // get uuid from token
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const decode = jwt.verifyAccessToken(token)
  console.log("uuid:",decode.data.uuid)
  console.log("tag:",req.body.tag)
  
  try {
    res.json(await tags.create(decode.data.uuid, req.body.tag));
  } catch (err) {
    console.error(`Error while creating tag`, err.message);
    next(err);
  }
  
});
//delete all tags of a uuid
router.delete('/',  authenticate.authenticateToken, async function(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const decode = jwt.verifyAccessToken(token)
  console.log("uuid:",decode.data.uuid)
  try {
    res.json(await tags.remove(decode.data.uuid));
  } catch (err) {
    console.error(`Error while deleting tag`, err.message);
    next(err);
  }
  
});

module.exports = router;