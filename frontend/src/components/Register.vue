<template>
  <v-container>
    <v-img
              class="mx-auto mt-0 mb-2"
              max-width="80"
              src="./matcha.png"
    ></v-img>
    <v-form ref="form">
    <v-card 
      class="mx-auto pa-10 pt-5 pb-8"
      elevation="8"
      max-width="600"
      min-width="280"
      rounded="lg"
      color="black" 
    >
    <v-card-title class="text-h5 font-weight-bold mx-auto pb-1 ">REGISTER</v-card-title>                        
    <v-text-field v-model="input.email"
      :rules="emailRules"
      label="Email"
      required
      outlined
      dense
      color="blue"
      :disabled="enable_code"
      autocomplete="false"
      class="mt-5"
    />
    <v-text-field v-model="input.username"
      :rules="usernameRules"
      label="Username"
      outlined
      dense
      color="blue"
      :disabled="enable_code"
      autocomplete="false"
    />
    <v-text-field v-model="input.first"
      label="First Name"
      outlined
      dense
      color="blue"
      :disabled="enable_code"
      autocomplete="false"
    />
    <v-text-field v-model="input.last"
      label="Last Name"
      outlined
      dense
      color="blue"
      :disabled="enable_code"
      autocomplete="false"
    />
    <v-text-field v-model="input.password"
      label="Password"
      :rules="passwordRules"
      outlined
      dense
      color="blue"
      :disabled="enable_code"
      autocomplete="false"
      :type="visiblePassword ? 'text' : 'password'"
      :append-inner-icon="visiblePassword ? 'mdi-eye-off' : 'mdi-eye'"                            
      @click:append-inner="visiblePassword = !visiblePassword"                           
    />
    <v-text-field v-model="input.passwordRepeat"
      :rules="passwordRepeatRules"
      label="Repeat Password"
      outlined
      dense
      color="blue"
      :disabled="enable_code"
      autocomplete="false"
      :append-inner-icon="visibleRepeat ? 'mdi-eye-off' : 'mdi-eye'"
      :type="visibleRepeat ? 'text' : 'password'"                            
      @click:append-inner="visibleRepeat = !visibleRepeat"
    />
    <v-card v-if="error===true"
        class="mb-1"
        color="surface-variant"
        variant="tonal"
    >
    <!---- error message --->
      <v-card-text class="pa-4 ma-0 text-red ">
          {{this.error_message}}
      </v-card-text>
    </v-card>
  <!---- Register email + otp --->
    <v-btn v-on:click.prevent = "registerEmailCode()" 
      class="ma-1"
      v-if="this.enable_register_verification_code ==='true'"
      type="submit"
      color="blue" 
      dark 
      block 
      tile>Send code verification
    </v-btn>
    <!--
    <v-text-field v-if="enable_code"
      v-model="user_code"
      label="Insert Code"
      outlined
      dense
      color="blue"
      autocomplete="false"                         
    />
    -->
    <div v-if="enable_code" class="text-caption text-center">
      Didn't receive the code? 
      <a href="#" @click.prevent="send_code">Resend</a>
    </div>
    <v-otp-input v-model="user_code"
      v-if="enable_code"
      :length="4" 
      variant="plain"
      color="primary"
    ></v-otp-input>        
      <!---- Register email link --->
      <v-btn  v-on:click.prevent = "registerEmailLink()"
        class="ma-1"
        v-if="enable_register_verification_link==='true'"
        type="submit"
        color="blue" 
        dark 
        block 
        tile>Send link verification
      </v-btn>
      <div v-if="enable_link" class="text-caption text-center">
        Didn't receive the email? 
       <a href="#" @click.prevent="send_link">Resend</a>
      </div>
      <!---- Register email classic --->
      <v-btn class="ma-1"
        v-if="enable_register_no_verification==='true'"
        v-on:click.prevent = "registerClassic()"                            
        type="submit"
        color="blue" 
        dark 
        block 
        tile
        >Register
      </v-btn>
      <v-card-text class="text-center text-white">
        <a class="text-center text-decoration-none mt-4 mb-3" >
          <router-link to="/login">Back to login <v-icon icon="mdi-chevron-right"></v-icon></router-link>
         </a>
      </v-card-text>
    </v-card>
    </v-form>
  </v-container>
</template>


<script>
  import authService from '../services/authService.js'
  import crypService from '../services/crypService.js'
  import axios from "axios"
  import store from '../store/index'

  import VOtpInput from "vue3-otp-input"; //https://www.npmjs.com/package/vue3-otp-input

  export default {
    components: {
      VOtpInput
  },
  data: () => ({
		error: false,
		error_message: "",
		info: false,
		info_message: "",
		input:{
      email: "dpzafra70@gmail.com",
			username: "pepe",
      first: "aa",
			last: "aa",
			password: "Abc@12345",
      passwordRepeat: "Abc@12345",
      coordinate_lon:"",
      coordinate_lat:""
		},
    code:"",
    user_code:"",
    visibleRepeat: false,
    visiblePassword: false,
    enable_code: false,
    enable_link: false,
    enable_register_no_verification: "",
    enable_register_verification_code: "",
    enable_register_verification_link: "",
    emailRules: [
      v => !!v || 'Email is required',
      v => (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)) || 'Must be a valid e-mail.'
    ],
    usernameRules: [
      v => !!v || 'Username is required',
      v => (v && v.length <= 10) || 'Name must be less than 11',
    ],
    passwordRules: [
      v => !!v || 'Password is required',
      v => (/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(v)) || 'The password must be a mixture of min 8 letter, with at least a symbol, upper and lower case letters and a number.'
    ],
    passwordRepeatRules: [
      v => !!v || 'Password is required.',
    ]
	}),
  props: {
  },
  methods:{  
    // validate form y data user //    
      async validate () {
        // validate rules of form
        const response = await this.$refs.form.validate()
        if (!response.valid) {
          return false
        }
        // check password_repeat
        if (this.input.password != this.input.passwordRepeat){
					this.error = true
					this.error_message = 'The password must be equal.'
					this.input.passwordRepeat=''
					return false
				}
        /// check if geolocation is enable
        try {
          const location = await this.getLocation();
          } catch(e) {
          alert('We can´t geolocate you \n'+e.message)
          //return false
        }
        /*
        try {
          const location = await this.getLocation();
          this.input.coordinate_lat = location.coords.latitude
          this.input.coordinate_lon = location.coords.longitude
        } catch(e) {
          alert('Please enable Geolocation in your wroser \n'+e.message)
          return false
        }
        */
        /// check if username and email not exists
				try {
					const user_username = this.input.username
					const response = await axios.get('/users?username='+user_username)
					if (response.data.length > 0){
						this.error = true
						this.error_message = "Oops.. username already exist"
						return false
					} 
					else {
						this.error = false
						
					}
				} catch (err) {
							this.error = true
							this.error_message = err
							return false
				}
        try {
					const user_email = this.input.email
					const response = await axios.get('/users?email='+user_email)
					if (response.data.length > 0){
						this.error = true
						this.error_message = "Oops.. email already exist"
						return false
					} 
					else {
						this.error = false
						//return true
					}
					} catch (err) {
							console.log(err)
							this.error = true
							this.error_message = err
							return false
					}  
          return true      
      },
    // method to register without email verification
      async registerClassic(){
        // Validate form data
				const form_ok = await this.validate()
				if(form_ok===true){
          this.register_user_classic()
          return true
        }
        return false
			},
    // method to register with email code verification
      async registerEmailCode(){
        // Validate form data
				const form_ok = await this.validate()
				if(form_ok===true){
          // enable input code + resend code button
          this.enable_code = true
          this.enable_link = false
          if (import.meta.env.VITE_DEBUG==='true'){
            console.log("info: sending email-code")
          }
          this.send_code()
          return true
        }
        return false
			},
    // send a code by email
      async send_code(){
          // enable input code + resend code button
          this.enable_code = true
          //generate code
          //this.code = Math.random().toString(36).slice(2,6)
          this.code = Math.floor(Math.random() *(9999 - 1000 + 1) + 1000).toString();
          //console.log(this.code)
          //const encrypCode = crypService.encrypt(this.code)
          //console.log(encrypCode)
          //call backend to send email with code and wait response
          const post_data = {
							'email': this.input.email,
							'username': this.input.username,
              'code': this.code // cambiar a encryptdado
          }
          let axiosConfig = {
						headers: {
							'Content-Type': 'application/json;charset=UTF-8',
							//'authorization': localStorage.getItem('token')
							//"Access-Control-Allow-Origin": "*",
						}
					};
          try {
						const response = await axios.post("/verifycode/", 
                    		post_data,axiosConfig)
            alert('A confirmation Code have been send by email')
            return true
					} catch (err) {
						if (import.meta.env.VITE_DEBUG==='true'){
              console.log("Error: "+err)
            }
            this.error = true
						this.error_message = "Email server:"+err.response.data.msg+". Try later..."
            return false
					} 
			},
    // method to register with email link verification
    // Backend->Send a mail with a link->emlink email-> backend register and send confirmation(with token) by socket to frontend
    // recieve confirmation by socket and set new token and route to / 
      async registerEmailLink(){
        // Validate form data
				const form_ok = await this.validate()
				if(form_ok===true){
          // enable message and disabled form
          this.enable_link = true
          this.enable_code = false
          if (import.meta.env.VITE_DEBUG==='true'){
            console.log("info: sending email-link")
          }
          this.send_link()
          return true
        }
        return false
			},
    // send a link
      async send_link(){
          // enable input code + resend code button
          this.enable_link = true
          this.enable_code = false
          // Get data and socket(from store)
          const post_data = {
            user_socket :  store.getters['user_store/getSocket'],
            user_data : {
                    'email': this.input.email,
                    'username': this.input.username,
                    'password':this.input.password,
                    'first': this.input.first,
                    'last': this.input.last,
                    'lon': this.input.coordinate_lon,
                    'lat': this.input.coordinate_lat
            }
          }
          //console.log(post_data.user_socket)
          //console.log(post_data.user_data)
          // Setting Http post
          let axiosConfig = {
						headers: {
							'Content-Type': 'application/json;charset=UTF-8',
							//'authorization': localStorage.getItem('token')
							//"Access-Control-Allow-Origin": "*",
						}
					};
          try {
						const response = await axios.post("/verifylink/", 
                    		post_data,axiosConfig)
            alert('A confirmation Link have been send by email')
            return true
					} catch (err) {
            if (import.meta.env.VITE_DEBUG==='true'){
							console.log("Error: "+err)
            }
							this.error = true
							this.error_message = this.error_message
              return false
					} 
			},
    // method to get location
      async getLocation() {
        const geo = await fetch('http://ip-api.com/json')
      .then(response => response.json())
      .catch (function(e){
        if (import.meta.env.VITE_DEBUG==='true'){console.log("error: getting coordinates from Api: ",e)}
          });
      if (import.meta.env.VITE_DEBUG==='true'){console.log("info: coordinates from api: ",geo)}
      this.input.coordinate_lat = geo.lat
      this.input.coordinate_lon = geo.lon
      },

    // Register a new user 
      async register_user(){
          const user_data = {
									'email': this.input.email,
									'username': this.input.username,
									'password':this.input.password,
									'first': this.input.first,
									'last': this.input.last,
									'lon': this.input.coordinate_lon,
									'lat': this.input.coordinate_lat
					}
          try {
            const response = await axios.post("/users", user_data)
            if (response.status=200){
              if (import.meta.env.VITE_DEBUG==='true'){
							  console.log("info: User registered")
                console.log(response)
              }
              authService.deleteToken()
							authService.setToken(response.data.token)
              alert('Thank you for register \n'+user_data.username)
              this.$router.push("/");
              return true
            }
          } catch (err) {
            if (import.meta.env.VITE_DEBUG==='true'){
							console.log(err)
            }
							this.error = true
							this.error_message = this.error_message
              return false
					}
      },
    // igual anterior con redirect to ./
      async register_user_classic(){
          const user_data = {
									'email': this.input.email,
									'username': this.input.username,
									'password':this.input.password,
									'first': this.input.first,
									'last': this.input.last,
									'lon': this.input.coordinate_lon,
									'lat': this.input.coordinate_lat
					}
          try {
            const response = await axios.post("/users", user_data)
            if (response.status=200){
              if (import.meta.env.VITE_DEBUG==='true'){
							  console.log("info: User registered")
                console.log(response)
              }
              authService.deleteToken()
							authService.setToken(response.data.token)
              alert('Thank you for register \n'+user_data.username)
              this.$router.push("/");
              return true
            }
          } catch (err) {
            if (import.meta.env.VITE_DEBUG==='true'){
							console.log(err)
            }
							this.error = true
							this.error_message = err.response
              return false
					}
      }
  },
	mounted() {
    // setting with register methods available
			this.enable_register_no_verification = import.meta.env.VITE_REGISTER_NO_VERIFICATION
			this.enable_register_verification_code = import.meta.env.VITE_REGISTER_CODE_VERIFICATION
      this.enable_register_verification_link = import.meta.env.VITE_REGISTER_EMAIL_VERIFICATION
	}, 
  computed:{
    // watch to change otp code
    code_change (){
      return (this.user_code)
    }
  },
  watch: {
    // watch to change otp code
		code_change(newer,older){
      if (import.meta.env.VITE_DEBUG==='true'){
			  console.log(`We have from ${older} to ${newer} code now, yay! of ${this.code}`)
      }
      if (newer === this.code){
        alert('You have have been verificated')
        this.register_user_classic()()
        //this.$router.push("/");
      }
    }
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