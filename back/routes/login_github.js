const express = require('express');
const router = express.Router();
const jwt = require('../services/jwt')
//const jwt = require('jsonwebtoken');
const socket_list = require('../sockets/socket_list')
var SocketSingleton = require('../sockets/socket');
const axios = require('axios')
const github = require('../controllers/login_github');
const { use } = require('bcrypt/promises');
const user = require('../controllers/users');

/// redirect to github oauth page
router.get("/auth/", async function(req, res, next) {
  res.redirect('https://github.com/login/oauth/authorize?client_id=' + process.env.CLIENTID_GITHUB)
})

router.get("/callback/", async function(req, res, next) {
  const git_code=req.query.code
  console.log(git_code)
  try {
      const result = await github.getGithubAuthToken(git_code)
      const auth_code = result.authToken.data.access_token
      const user_data = await github.userGithubData(auth_code)
      const user_matcha = {
        'username' : user_data.userResponse.data.login,
        'email' :user_data.userResponse.data.email,
        'password': 'password',
        'first': '',
        'last': ''
      }
      // check if user exist 
      const email_exist = await user.getOnes('email="'+user_data.userResponse.data.email+'" ') //check if exits email
      // if first login create
      if (email_exist.length > 0){ 
      //console.log('exist')
      } else {  
      //console.log('create')
      //Check if username exits if so put random number
        const us_ex = await user.getOnes('username="'+ user_matcha.username +'" ')
        if (us_ex.length > 0) {
          let username_exist
          while(1){
            do {
              number = Math.floor(Math.random() * 999);
            } while (number < 100);
            const test_username = user_matcha.username + number
            username_exist = await user.getOnes('username="'+ test_username +'" ') //check if exits username
            console.log(username_exist.length)
            if (username_exist.length === 0) {
              user_matcha.username = test_username
              break
            }
          }
        }       
        const result2 = user.create(user_matcha)  // if first login create
      }

      await new Promise(resolve => setTimeout(resolve, 100)); //just a dealy to finish insert
      const def_user = await user.getOnes('email="'+user_data.userResponse.data.email+'" ')
      //console.log (def_user)
      const jwt_token = jwt.generateAccessToken({"user_uuid": def_user.uuid}) //generate a token with the user's uuid
      console.log(req.headers)
      let host = req.headers.host;
      const protocol = req.secure ? 'https' : 'http';
      host =  host.split(':')[0]+':8000'
      return res.redirect(`${protocol}://${host}?token=${jwt_token}`);
      //return res.redirect('http://localhost:8000');
      // res.status(200).json(
      //   {'data': def_user[0],
      //   'token': jwt_token})
      // return
  } catch (err) {
    console.error("Token Git hub exchange failed:", err.code);
      next(err);
  }
})
module.exports = router;