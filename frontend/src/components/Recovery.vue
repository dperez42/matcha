<template>
  <v-container>
    <v-img
      class="mx-auto mt-0 mb-2"
      max-width="80"
      src="./matcha.png"
    ></v-img>
    <v-card 
              class="mx-auto pa-10 pt-5 pb-8"
              elevation="8"
              max-width="600"
              min-width="280"
              rounded="lg"
              color="black" 
            >
            <v-card-title class="text-h5 font-weight-bold mx-auto pb-1">RECOVERY</v-card-title>
            <v-form ref="form">
            <v-text-field
              v-model="input.email"
              :rules="emailRules"
              density="compact"
              placeholder="Email"
              prepend-inner-icon="mdi-email"
              variant="outlined"
            ></v-text-field>
            </v-form>
            <v-btn
                v-on:click.prevent = "passwordRecovery()" 
                class="mb-0"
                color="blue"
                size="large"
                variant="tonal"
                block
              >
              Submit
            </v-btn>
            <v-card
              class="mb-12"
              color="surface-variant"
              variant="tonal"
            >
              <v-card-text v-if="error===true" class="text-red pa-4 ma-0 ">
                {{this.error_message}}
              </v-card-text>
            </v-card>
            <v-card-text class="text-center text-white">
              <a class="text-center text-decoration-none mt-4 mb-3" >
                <router-link to="/login">Back to login? <v-icon icon="mdi-chevron-right"></v-icon></router-link>
              </a>
            </v-card-text>
    </v-card> 
  </v-container>
</template>

<script>
  import auth from '../services/authService.js'
  import axios from "axios"

  export default {
    data: () => ({
		error: false,
		error_message: "",
		input:{
			email: "",
		},
    emailRules: [
      v => !!v || 'Email is required',
      v => (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)) || 'Must be a valid e-mail.'
    ],
	}),
  props: {
  },
  methods:{
        // Check if email exist -> send order to backend to sent email with link recovery
      async passwordRecovery(){
        // validate rules of form
        const response = await this.$refs.form.validate()
        if (!response.valid) {
          this.error=true
		      this.error_message= "Oops.. please enter an email."
          return false
        }
        const user_data = {
          'email': this.input.email,
			  }
			  try {
				const response = await axios.post("/reset", user_data)				
				//console.log("response",response.data);
        //toast("Send recovy link to email ", this.input.email)
        //this.showInfoModal = true
				alert('A recovery link have been send to '+this.input.email)
        this.$router.push("/login");
			} catch (err) {
				console.log(err)
				this.error = true
				this.error_message = "Ooops... email not exit."
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