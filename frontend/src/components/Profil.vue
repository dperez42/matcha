<template>
  <v-container fluid >
  <v-row align="center" justify="center" >
  <v-col cols="12" sm="12">
    <v-card class="elevation-10 mt-5" color="black" >
      
      <v-row>
      <v-col cols="12" md="12">
      <v-card-text class="mt-5" >
      
      <!-- lienzo donde estan las cosas -->
      <v-row align="center" justify="center">
      <v-col cols="12" sm="11">
        <!-- row of title --->
          <v-row>
            <v-col cols="12" md="6" align="center" >
            
            <div class="text-h3 text-white font-weight-medium ">{{card.username}}</div>
            </v-col>
            <v-col cols="12" md="6" align="end" align-self="end">
              <div v-if ="!on_line" class="text-h4 text-red">OFF LINE</div>
              <div v-if = "on_line" class="text-h4 text-green">ON LINE</div>
              <div class="text-grey">Last seen: {{card.lastseen}}</div>
              <div class="text-grey">Registered from: {{new Date(card.registered).toDateString()}}</div>
            </v-col>
          </v-row>
        <!-- pictures-->
          <v-row>
            <v-col cols="12" md="6" align="center">
              <!-- avatar    :src="'localhost:3000/uploads/'+this.$store.state.user_store.user.avatar"-->
                <v-row align="center" justify="center">
                  <v-col cols="12" md="12" align="center">
                    <v-img
                      alt="John"
                      width="300"
                      cover
                      
                      :lazy-src="$APP_SERVER_API+'/uploads/'+this.$store.state.user_store.user.avatar"
                      
                      :src="$APP_SERVER_API+'/uploads/'+this.$store.state.user_store.user.avatar"
                    >
                      <template v-slot:placeholder>
                        <v-row
                          align="center"
                          class="fill-height ma-0"
                          justify="center"
                          >
                          <v-progress-circular
                            color="grey-lighten-5"
                            indeterminate
                          ></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                                          
                  </v-col>
                </v-row>
                          <!-- rating -->
                          <v-row align="center" justify="center">
                            <v-col cols="12" sm="12" align="center">
                            <v-rating
                                :length="6"
                                :size="32"
                                :model-value="card.rating"
                                active-color="yellow-darken-3"
                                color="orange-lighten-1"
                                readonly
                            />
                            </v-col>
                          </v-row>
            </v-col>
                          <!-- row of images -->
            <v-col cols="12" md="6" align="center">
                          <v-row align="center" justify="center">
                            <v-col
                              v-for="n in 2"
                              :key="n"
                              class="d-flex child-flex"
                              cols="6"
                            >
                              <v-img
                                :lazy-src="this.$APP_SERVER_API+'/uploads/'+(n===1?this.$store.state.user_store.user.img1:this.$store.state.user_store.user.img2)"
                                :src="this.$APP_SERVER_API+'/uploads/'+(n===1?this.$store.state.user_store.user.img1:this.$store.state.user_store.user.img2)"
                                aspect-ratio="1"
                                class="bg-grey-lighten-2"
                                cover
                              >
                                <template v-slot:placeholder>
                                  <v-row
                                    align="center"
                                    class="fill-height ma-0"
                                    justify="center"
                                  >
                                    <v-progress-circular
                                      color="grey-lighten-5"
                                      indeterminate
                                    ></v-progress-circular>
                                  </v-row>
                                </template>
                              </v-img>
                            </v-col>
                          </v-row>
                          <v-row align="center" justify="center">
                            <v-col
                              v-for="n in 2"
                              :key="n"
                              class="d-flex child-flex"
                              cols="6"
                            >
                              <v-img
                                :lazy-src="$APP_SERVER_API+'/uploads/'+(n===1?this.$store.state.user_store.user.img1:this.$store.state.user_store.user.img4)"
                                :src="$APP_SERVER_API+'/uploads/'+(n===1?this.$store.state.user_store.user.img1:this.$store.state.user_store.user.img4)"
                                aspect-ratio="1"
                                class="bg-grey-lighten-2"
                                cover
                              >
                                <template v-slot:placeholder>
                                  <v-row
                                    align="center"
                                    class="fill-height ma-0"
                                    justify="center"
                                  >
                                    <v-progress-circular
                                      color="grey-lighten-5"
                                      indeterminate
                                    ></v-progress-circular>
                                  </v-row>
                                </template>
                              </v-img>
                            </v-col>
                          </v-row>
            </v-col>
          </v-row>
        <!-- User info A-->
          <v-row>
              <v-col cols="12" md="2">
                <div class="text-caption pa-2 ">
                  <div class="text-grey">Title</div>
                  <div class="text-h4 font-weight-medium">{{ card.title }}</div>
                </div>
              </v-col>
              <v-col cols="12" md="5">
                <div class="text-caption pa-2 ">
                  <div class="text-grey">First Name</div>
                  <div class="text-h4 font-weight-medium">{{ card.first }}</div>
                </div>     
              </v-col>
              <v-col cols="12" md="5">
                <div class="text-caption pa-2 ">
                  <div class="text-grey">Second Name</div>
                  <div class="text-h4 font-weight-medium">{{ card.last }}</div>
                </div>      
              </v-col>
          </v-row> 
          <v-row>
              <v-col cols="12" md="4">
                <div class="text-caption pa-2 ">
                  <div class="text-grey">Cell</div>
                  <div class="text-h5 font-weight-medium">{{ user_temp.cell }}</div>
                </div>      
              </v-col>
              <v-col cols="12" md="4">
                <div class="text-caption pa-2 ">
                  <div class="text-grey">Phone</div>
                  <div class="text-h5 font-weight-medium">{{ card.phone }}</div>
                </div> 
              </v-col> 
              <v-col cols="12" md="4">
              <div class="text-caption pa-2 ">
                  <div class="text-grey">Birthdate</div>
                  <div class="text-h5 font-weight-medium">{{ new Date(card.date).toDateString() }}</div>
                </div> 
              </v-col>
          </v-row> 
        <!-- Gender and sexual preferences -->
          <v-row>
              <v-col cols="12" md="6" align="center">
                <div class="text-caption pa-2 ">
                  <div class="text-grey">Gender</div>
                  <div class="text-h5 font-weight-medium">{{ card.gender }}</div>
                </div>                                 
              </v-col>
              <v-col cols="12" md="6" align="center">
                <div class="text-caption pa-2 ">
                  <div class="text-grey">Sexual preferences</div>
                  <div class="text-h5 font-weight-medium">{{ card.sexual }}</div>
                </div>                                    
              </v-col>
          </v-row> 
        <!-- Location -->
          <v-row>
              <v-col cols="12" md="7">
                <div class="text-caption pa-2 ">
                  <div class="text-grey">Address</div>
                  <div class="text-h5 font-weight-medium">{{ card.address }}</div>
                </div>       
              </v-col>
              <v-col cols="12" md="5">
                <div class="text-caption pa-2 ">
                  <div class="text-grey">City</div>
                  <div class="text-h5 font-weight-medium">{{ user_temp.city }}</div>
                </div>       
              </v-col>
          </v-row> 
          <v-row>
              <v-col cols="12" md="6">
                <div class="text-caption pa-2 ">
                  <div class="text-grey">State
                  </div>
                  <div class="text-h5 font-weight-medium">{{ user_temp.state }}</div>
                </div>       
              </v-col>
              <v-col cols="12" md="3">
                <div class="text-caption pa-2 ">
                  <div class="text-grey">Zip code
                  </div>
                  <div class="text-h5 font-weight-medium">{{ user_temp.zip}}</div>
                </div> 
              </v-col> 
              <v-col cols="12" md="3">
                <div class="text-caption pa-2 ">
                  <div class="text-grey">Country
                  </div>
                  <div class="text-h5 font-weight-medium">{{ user_temp.country}}</div>
                </div>                                   
              </v-col>
          </v-row> 
        <!-- Interest -->
          <v-row>
              <v-col cols="12" md="8">
              <div class="text-caption pa-2 ">
                  <div class="text-grey">Biography</div>
                  <div class="text-h6 font-weight-medium">
                    <p>{{ user_temp.bio}}</p>
                  </div>
                </div>       
              </v-col>
              <v-col cols="12" md="4">
                <div class="text-caption pa-2 ">
                  <div class="text-grey">Tags</div>
                  <div class="text-h6 font-weight-medium">
                      <TagList :tags="list_tags" :edit="false" />
                  </div>
                </div>     
              </v-col>
          </v-row>               
      </v-col>
      </v-row>

          <!-- linea actions -->
            <v-row>
                            <v-col cols="12" md ="4">
                              <v-btn
                                color="secondary"
                                outlined
                                tile
                                block
                                class="pa-6 font-weight-bold"
                                elevation="0"
                                @click="currentSignUpStep = 1"
                                >Back</v-btn
                              >
                            </v-col>
                            <v-col cols="12" md="4"
                              ><v-btn
                                color="info"
                                dark
                                tile
                                block
                                class="pa-6 font-weight-bold"
                                elevation="0"
                                @click="saveFormData()"
                                >Sign Up</v-btn
                              ></v-col
                            >
                            <v-col cols="12" md="2"
                              ><v-btn
                                color="info"
                                dark
                                tile
                                block
                                class="pa-6 font-weight-bold"
                                elevation="0"
                                @click="saveFormData()"
                                >Sign Up</v-btn
                              ></v-col
                            >
                            <v-col cols="12" md="2"
                              ><v-btn
                                color="info"
                                dark
                                tile
                                block
                                class="pa-6 font-weight-bold"
                                elevation="0"
                                @click="saveFormData()"
                                >
                                  <v-icon color="green-darken-2"
                                  icon="mdi-heart"
                                  size="large">
                                  </v-icon>
                                  
                                Sign Up
                                <v-icon color="white-darken-2"
                                  icon="mdi-heart-outline"
                                  size="large">
                                  </v-icon>
                                  <v-icon color="white-darken-2"
                                  icon="mdi-message-text"
                                  size="large">
                                  </v-icon>
                                </v-btn
                              ></v-col
                            >
            </v-row>
      
      </v-card-text>
      </v-col>
      </v-row>
  
            </v-card>
          </v-col>
      </v-row>
  </v-container>
</template>


<script>
  import authService from '../services/authService.js'
  import crypService from '../services/crypService.js'
  import axios from "axios"
  import store from '../store/index'
  import { toast } from 'vue3-toastify';
  
  export default {
    components: {
  },
  data: () => ({
		error: false,
		error_message: "",
		info: false,
		info_message: "",
    user_temp: "",
    on_line: false,
    list_tags: null,
    list_title: ["Mr","Ms","Miss"],
    list_countries: ['SP','US'],
		list_gender: ["Male", "Female", "Transgender", "Cisgender", "Intersex","Genderfluid", "Non-binary gender", "Agender" ,"Bigender", "Demigender" ,"MTF" ,"Androgyne", "Genderbroken", "Two-spirit", "Gender identity disorder" ,"Aliagender" ,"Ambigender","Bisexual" ,"Butch", "Genderfae", "Genderflux", "Gendervoid", "Masculine gender", "Questioning"],
		list_sexual: ["Bisexual", "Heterosexual", "Homosexual", "Asexual" ,"Autosexual","Demisexual", "Gray-asexuality","Pansexual", "Queer", "Questioning" ],
    enable_code: false,
    enable_register_verification_code: "",
    enable_register_verification_link: "",
	}),
  props: {
    card: {
      type: Object,
      required: true,
    },
    user: {       
      type: Object,
      required: true,
    }
  },
  methods:{  

  },
	mounted() {
   //this.user_temp = card //store.getters['user_store/getUser']
   this.list_tags = JSON.parse(this.card.tags)
   console.log(this.list_tags)
	}, 
  computed:{
    // check is online
    },
  watch: {
    // check is online
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