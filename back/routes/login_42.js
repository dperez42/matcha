const express = require('express');
const router = express.Router();
const jwt = require('../services/jwt')
const socket_list = require('../sockets/socket_list')
var SocketSingleton = require('../sockets/socket');
const axios = require('axios')
const login42 = require('../controllers/login_42')
const user = require('../controllers/users');

/// redirect to 42 oauth page
router.get("/auth/", async function(req, res, next) {
  res.redirect('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-52805e1089b109a717afb9a2cc47444f5ab21b704fa709149433be73b1800c90&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F42%2Fcallback&response_type=code')
})

/// recieve callback from oauth 42, in req.query.code give authenticathion code
router.get("/callback/", async function(req, res, next) {
  //console.log("42 request:", req.query.code )
  const g42_code=req.query.code
  try {
      const auth_token= await login42.get42AuthToken(g42_code)  //with code get auth key
      const user_data = await login42.user42Data(auth_token)    //with auth key retrieve user information
      //console.log(user_data.userResponse.data)
      const user_matcha = {                                     //takes only info needed fro matcha
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
            //console.log(username_exist.length)
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
      const jwt_token = jwt.generateAccessToken({"user_uuid": def_user.uuid})
      //console.log(req.headers)
      let host = req.headers.host;
      const protocol = req.secure ? 'https' : 'http';
      host =  host.split(':')[0]+':8000'
      return res.redirect(`${protocol}://${host}?token=${jwt_token}`);
      } catch (err) {
        console.error("Token exchange failed:", err.response.data);
        next(err);
      }   
})
module.exports = router;