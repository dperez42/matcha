<template>
<v-card class="mx-auto my-0 pa-0 overflow-y-auto"
    color="black"
    elevation="16"
    width="100vw"
    height="100vh">
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
            <v-card-title class="text-h5 font-weight-bold mx-auto pb-1">RESET PASSWORD</v-card-title>
            <v-text-field
              v-model="input.password"
              :rules="passwordRules"
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visible ? 'text' : 'password'"
              density="compact"
              placeholder="New Password"
              prepend-inner-icon="mdi-lock-outline"
              variant="outlined"
              @click:append-inner="visible = !visible"
            ></v-text-field>
            <v-text-field
              v-model="input.passwordRepeat"
              :rules="passwordRules"
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visible ? 'text' : 'password'"
              density="compact"
              placeholder="Repeat Password"
              prepend-inner-icon="mdi-lock-outline"
              variant="outlined"
              @click:append-inner="visible = !visible"
            ></v-text-field>
            <v-btn
                v-on:click.prevent = "passwordReset()" 
                class="mb-0"
                color="blue"
                size="large"
                variant="tonal"
                block
              >
              Reset
            </v-btn>
            <v-card
              class="mb-12"
              color="surface-variant"
              variant="tonal"
            >
              <v-card-text v-if="error===true" class="pa-4 ma-0 text-red ">
                {{this.error_message}}
              </v-card-text>
            </v-card>
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
    visible:true,
		input:{
				password: "",
				passwordRepeat: "",
		},
    passwordRules: [
      v => !!v || 'Password is required',
      v => (/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(v)) || 'The password must be a mixture of min 8 letter, with at least a symbol, upper and lower case letters and a number.'
    ],
	}),
  props: {
  },
  methods:{
        // Check if email exist -> send order to backend to sent email with link recovery
      async passwordReset(){
        this.error = false
        // validate rules of form
        const response = await this.$refs.form.validate()
        if (!response.valid) {
          return false
        }
        console.log(this.input.password+ " "+this.input.passwordRepeat)
        // validate equal password 
        if (this.input.password === this.input.passwordRepeat){
					this.error = false
				} else {	
					this.error = true
					this.error_message = 'Opss. Passwords must be equal.'
					this.input.passwordRepeat=''
					return false
				}
        // change password in database
        const token = localStorage.getItem('matcha_token');
        var post_data = {
          'password': this.input.password,
			  };
        let axiosConfig = {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
				    'Authorization': `Bearer ${token}`,
                    //"Access-Control-Allow-Origin": "*",
            }
        };
        try {
			    const response = await axios.post("/resetpassword/", post_data, axiosConfig)	           	
				  console.log("info: reset password completed");
				  this.$router.push("/login");
			  } catch (err) {
          console.log("error: resetting password. ",err)
          localStorage.removeItem('token')
          this.error = true
          this.error_message = err.response.data.error
        } 
      },
  }  
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