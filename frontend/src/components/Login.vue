<template>
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
            <v-card-text v-if="this.enable_auth ==='true'" class="text-center pa-1">
              <a
                class="text-white text-decoration-none font-weight-bold"
              >
                Or
              </a>
            </v-card-text>
            <div v-if="this.enable_auth ==='true'" class="d-flex  justify-space-between align-center">
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
            <!--
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-card-text class="mt-12">
                        <v-row align="center" justify="center">
                          <v-col cols="12" sm="8">
                            <v-text-field
                                v-model="input.username"
                                label="Username"
                                outlined
                                dense
                                color="blue"
                                autocomplete="false"
                            class="mt-16"
                            />
                            <v-text-field
                                v-model="input.password"
                                label="Password"
                                outlined
                                dense
                                color="blue"
                                autocomplete="false"
                                type="password"                            
                            />
                            <h4 v-if="error===true"
                                class ="text-center grey--text mt-4 mb-3">
                                {{this.error_message}}
                            </h4>
                            <v-btn 
                                v-on:click.prevent = "login()" 
                                type="submit"
                                color="blue" 
                                dark 
                                block 
                                tile>Log in</v-btn>
                            <h5
                            class="text-center  grey--text mt-4 mb-3"
                            >Or Log in using</h5>
                            <div class="d-flex  justify-space-between align-center mx-10 mb-16">
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
                            <p class="text-center  grey--text mt-4 mb-3" > 
                                ¿Has olvidado tu contraseña?
                                <router-link to="/recovery">Recuperar contraseña</router-link>
                            </p>
                            <p class="text-center  grey--text mt-4 mb-3" > 
                                ¿No tienes cuenta?
                                <router-link to="/register">Regístrate</router-link>
                            </p>
                            <p class="text-center  grey--text mt-4 mb-3" > 
                                ¿No tienes cuenta?
                                <router-link to="/reset">Reset</router-link>
                            </p>
                          </v-col>
                        </v-row>  
                      </v-card-text>
                    </v-col>
                  </v-row>
            -->
            </v-card>
            </v-form>
  </v-container>
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
          'ngrok-skip-browser-warning': 'true',
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
      this.enable_auth = this.$AUTH
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