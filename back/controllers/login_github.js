const axios = require('axios')

////// GET AUTH TOKEN ////////
async function getGithubAuthToken(auth_code){

    const authToken = await axios.post("https://github.com/login/oauth/access_token", {
        client_id: process.env.CLIENTID_GITHUB, //"0f838192a9b2f96cb3e9",
        client_secret: process.env.CLIENTSECRET_GITHUB, //"350f8a5e84eede34504457ef81a973111f518562",
        code: auth_code
    }, {
        headers: {
            Accept: "application/json"
        }
    })
  
    return {
        authToken
    }
  }


////// GET USER DATA ////////
async function userGithubData(auth_code){

    const userResponse = await axios.get("https://api.github.com/user",
        {
          headers: {
            Authorization: `Bearer ${auth_code}`
          }
        }
      );
  
    return {
        userResponse
    }
  }

  module.exports = {
    getGithubAuthToken,
    userGithubData
  }