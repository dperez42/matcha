<template>
<v-card class="mx-auto my-0 pa-0 overflow-y-auto"
    color="black"
    elevation="16"
    width="100vw"
    height="100vh">
  <v-container >
            <v-img
              class="mx-auto mt-0 mb-2"
              max-width="80"
              src="./matcha.png"
            ></v-img>
            <v-form ref="form">
            <v-card 
              class="mx-auto px-10 pt-5 pb-8"
              elevation="8"
              max-width="600"
              min-width="280"
              rounded="lg"
              color="black" 
            >
            <v-card-title class="text-h5 font-weight-bold mx-auto pb-1">ACCOUNT</v-card-title>
            <v-text-field
              v-model="input.username"
              :rules="usernameRules"
              density="compact"
              placeholder="Username"
              prepend-inner-icon="mdi-account"
              variant="outlined"
            ></v-text-field>
            <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between text-white">
              Password
              <a class="text-caption text-decoration-none text-blue" > 
                <router-link to="/recovery">Forgot login password?</router-link>
              </a>
            </div>
            <v-text-field
              v-model="input.password"
              :rules="passwordRules"
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visible ? 'text' : 'password'"
              density="compact"
              placeholder="Enter your password"
              prepend-inner-icon="mdi-lock-outline"
              variant="outlined"
              @click:append-inner="visible = !visible"
            ></v-text-field>
            <v-btn
                v-on:click.prevent = "login()" 
                class="mb-0"
                color="blue"
                size="large"
                variant="tonal"
                block
              >
              Log In
            </v-btn>
            <v-card v-if="error===true"
              class="mb-1"
              color="surface-variant"
              variant="tonal"
            >
              <v-card-text v-if="error===true" class="pa-4 ma-0 text-red ">
                {{this.error_message}}
              </v-card-text>
            </v-card>
            <v-card-text v-if="this.enable_auth ===true" class="text-center pa-1">
              <a
                class="text-white text-decoration-none font-weight-bold"
              >
                Or
              </a>
            </v-card-text>
            <div v-if="this.enable_auth ===true" class="d-flex  justify-space-between align-center">
                                <v-btn depressed outlined color="white">
                                <v-icon color="red">mdi-google</v-icon>
                                </v-btn>
                                <v-btn depressed outlined color="white">
                                <v-icon color="blue">mdi-github</v-icon>
                                </v-btn>
                                <v-btn depressed outlined color="white">
                                <v-icon color="light-blue lighten-3">mdi-github</v-icon>
                                </v-btn>
                            </div>
            <v-card-text class="text-center text-white">
              <a class="text-center text-decoration-none mt-4 mb-3" >
                <router-link to="/register">Sign up now <v-icon icon="mdi-chevron-right"></v-icon></router-link>
              </a>
            </v-card-text>
            </v-card>
            </v-form>
  </v-container>
</v-card>
</template>

<script>
  import auth from '../services/authService.js'
  import axios from "axios"

  export default {
    data: () => ({
		error: false,
		error_message: "",
    visible: false,
    enable_auth: false,
		input:{
			username: "",
			password: "",
		},
    usernameRules: [
      v => !!v || 'Username is required',
    ],
    passwordRules: [
      v => !!v || 'Password is required',
    ],
	}),
  props: {
  },
  methods:{
      // call backend for login //
      async login(){
		//make sure username OR password are not empty
        if (this.input.username==="" || this.input.password ===""){
            this.error = true
            this.error_message = "empty fields"
            return
        }
		try {
			//const response = await auth.login(this.input.username, this.input.password);
			let axiosConfig = {
				headers: {
					'Content-Type': 'application/json;charset=UTF-8',
          'ngrok-skip-browser-warning': true,
					//'Socket': "ll" //store.getters['user_store/getSocket']
					//"Access-Control-Allow-Origin": "*",
				}
			};
      let data = {
        username: this.input.username,
        password: this.input.password
      }
			const response = await axios.post("/login",data,
				axiosConfig)
      if (import.meta.env.VITE_DEBUG==='true'){
        console.log("info: login success. ", response)
      }
			auth.deleteToken()
			auth.setToken(response.data.token)
			this.error = false;
			this.$router.push("/");
		} catch (err) {
      if (import.meta.env.VITE_DEBUG==='true'){
        console.log("error: login failed. ", err.response)
      }
			this.error_message = "Oops... Username or password incorrect."
			this.error = true;
			}
		},
  },
  mounted() {
  },   
      
  }
</script>
<style scoped>
.v-application .rounded-bl-xl {
    border-bottom-left-radius: 300px !important;
}
.v-application .rounded-br-xl {
    border-bottom-right-radius: 300px !important;
}
</style>