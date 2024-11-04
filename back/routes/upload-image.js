const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const jwt = require('../services/jwt');
const email = require('../services/email')
const authenticate = require('../services/authenticate')
//const upload = require('../services/upload')
/* GET programming languages. */
// router.get('/', async function(req, res, next) {
//   try {
//     res.json(await users.getMultiple(req.query.page));
//   } catch (err) {
//     console.error(`Error while getting programming languages `, err.message);
//     next(err);
//   }
// });
const multer = require("multer");
// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //cb(null, 'public/images/');
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    //cb(null, Date.now() + '-' + file.originalname);
    cb(null,  req.body.name);
  }
});
// Create the multer instance
const upload = multer({ storage: storage });
//const upload = multer({ dest: "uploads/" });
//create a unique get with query authenticate.authenticateToken, upload.single('file'),
router.post('/', authenticate.authenticateToken, upload.single('image'), function(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const decode = jwt.verifyAccessToken(token)
  console.log("image of", decode.data.uuid)
  console.log(req.body.name)
  console.log(req.body.id)

  res.json({ message: 'File uploaded successfully!' });
});

module.exports = router;