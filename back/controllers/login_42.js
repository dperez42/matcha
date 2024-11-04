const axios = require('axios')

////// GET AUTH TOKEN ////////
async function get42AuthToken(auth_code){
    console.log("key", auth_code)
    const result = await axios.post("https://api.intra.42.fr/oauth/token", {
        grant_type: "authorization_code",
        client_id: process.env.CLIENTID_42, //"u-s4t2ud-52805e1089b109a717afb9a2cc47444f5ab21b704fa709149433be73b1800c90",
        client_secret: process.env.CLIENTSECRET_42, //"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",
        code: auth_code,
        redirect_uri: process.env.REDIRECT_URL_42, //"http://localhost:8000/42callback"
    }, {
        headers: {
            Accept: "application/json"
        } 
    })
    //console.log(result.data.access_token)
    //const authToken = result.data
    //console.log(authToken)
    return  result.data.access_token

  }

////// GET USER DATA ////////
async function user42Data(auth_token){
  console.log("aqui",auth_token)
    const userResponse = await axios.get("https://api.intra.42.fr/v2/me",
        {
          headers: {
            Authorization: `Bearer ${auth_token}`
          }
        }
      );
  
    return {
        userResponse
    }
  }

  module.exports = {
    get42AuthToken,
    user42Data
  }