import axios from "axios"

export default {
  // Set matcha_token //
  setToken(token){
    if (import.meta.env.VITE_DEBUG ==='true'){
      console.log("info: set new matcha_token", token)
    }
    localStorage.setItem('matcha_token', token)
  },
  // Get matcha_token //
  getToken(){
    if (import.meta.env.VITE_DEBUG==='true'){
      console.log("info: get a matcha_token")
    }
    return localStorage.getItem('matcha_token')
  },
  // Delete matcha_token //
  deleteToken(){
    if (import.meta.env.VITE_DEBUG==='true'){
      console.log("info: delete matcha_token")
    }
    localStorage.removeItem('matcha_token')
    //this.$router.push("/");
  },
  // Call Backend to verify token is valid //
  async checkToken(){
    if (localStorage.getItem('matcha_token')){
        // check is valid 
        const token = localStorage.getItem('matcha_token')
        let axiosConfig = {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          }
        }  
        const response = await axios.get("/auth?key=" + token, axiosConfig);
        if (import.meta.env.VITE_DEBUG==='true'){
          console.log("info: getting renew matcha_token")
        }
        this.setToken(response.data.renew_token)
        if(response.data.status === 'Authorized'){
          if (import.meta.env.VITE_DEBUG==='true'){
            console.log("info: found Authorized matcha_token")
          }
          return(true)
        } else {  
          console.log("info: found UnAuthorized matcha_token")
          return(false)
        }
    }
    localStorage.removeItem('matcha_token')
    if (import.meta.env.VITE_DEBUG==='true'){
      console.log("info: not found matcha_token")
    }
    return false
  },
};
