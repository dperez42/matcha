const express = require('express');
const router = express.Router();
const tags = require('../controllers/tags');
const authenticate = require('../services/authenticate')
const jwt = require('../services/jwt');

// get distinct tags
router.get('/', authenticate.authenticateToken, async function(req, res, next) {
  console.log("distinct.js")
  try {
    res.json(await tags.getDistinct()); 
  } catch (err) {
    console.error(`Error while gettting list tags`, err.message);
    next(err);
  }
});
//add
//delete

module.exports = router;