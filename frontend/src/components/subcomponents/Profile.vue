<template>
<v-container v-if="isLoading" fluid style="padding: 0;">
  LOADING
</v-container>
<v-container v-else-if="error" fluid style="padding: 0;">
  <Error500/>
</v-container>
<v-container v-else fluid style="padding: 0;">
    <v-row no-gutters>
      <v-col sm="12" style="position: relative;">
  <!-- HEADER -->
        <v-row>
          <v-col sm="12">
          <div class="header-container">
            <v-card class="elevation-10 pa-5" color="#952175">
              <v-row align="center" justify="center">
                <v-col col="12" md="6">
                  <v-row>
                      <v-text-field class="text-h4 text-white text-right">
                        {{this.card.username}} 
                      </v-text-field >
                  </v-row>
                  <v-row>
                      <v-text-field class="text-white text-right">
                        {{this.card.first}} {{this.card.last}}, {{this.card.age}} years.
                      </v-text-field>
                  </v-row>
                </v-col>
                <v-col col="12" md="6">
                  <v-row >
                      <v-text-field class="text-white text-right">
                        {{this.online_check?'ON LINE':'OFF LINE: Last seen..'}}{{this.online_check?'':this.card.lastseen.substring(0,19)}}
                      </v-text-field>
                      <v-icon size="25" :color="this.online_check ? 'success':'error'" icon="mdi-wifi"></v-icon>
                  </v-row>
                  <v-row >
                      <v-text-field class="text-white text-right">
                       At {{parseInt(card.distance)}} kms
                      </v-text-field>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </div>
          </v-col>
        </v-row>
  <!-- BOARD-->      
        <v-row>
          <v-col col="12" sm="12">
            <div class="board-container">
              <v-card class="elevation-10 mt-0" color="black" >
                <v-row align="center" justify="center">
  <!-- avatar + rating-->
              <v-col cols="12" md="4" align="center">
              <!-- avatar    :src="'localhost:3000/uploads/'+this.$store.state.user_store.user.avatar"-->
                <v-row align="center" justify="center">
                  <v-col cols="12" md="12" align="center">
                    <v-img
                      alt="John"
                      width="300"
                      cover
                      :lazy-src="card.avatar.startsWith('https') ? card.avatar : this.$APP_SERVER_API+'/uploads/'+card.avatar"
                      :src="card.avatar.startsWith('https') ? card.avatar : this.$APP_SERVER_API+'/uploads/'+card.avatar"
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
                                :length="5"
                                :size="32"
                                :model-value="card.rating"
                                active-color="yellow-darken-3"
                                color="orange-lighten-1"
                                readonly
                            />
                            </v-col>
                </v-row>
                <!-- sexual -->
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
              </v-col>
  <!--- pictures -->
              <v-col cols="12" md="6" align="center">
                <v-row align="center" justify="center">
                  <v-col
                    class="d-flex child-flex"
                    cols="6"
                  >
                    <v-img
                      :lazy-src="card.img1.startsWith('https') ? card.img1 : this.$APP_SERVER_API+'/uploads/'+card.img1"
                      :src="card.img1.startsWith('https') ? card.img1 : this.$APP_SERVER_API+'/uploads/'+card.img1"
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
                  <v-col
                    class="d-flex child-flex"
                    cols="6"
                  >
                    <v-img
                      :lazy-src="card.img2.startsWith('https') ? card.img2 : this.$APP_SERVER_API+'/uploads/'+card.img2"
                      :src="card.img2.startsWith('https') ? card.img2 : this.$APP_SERVER_API+'/uploads/'+card.img2"
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
                    class="d-flex child-flex"
                    cols="6"
                  >
                    <v-img
                      :lazy-src="card.img3.startsWith('https') ? card.img3 : this.$APP_SERVER_API+'/uploads/'+card.img3"
                      :src="card.img3.startsWith('https') ? card.img3 : this.$APP_SERVER_API+'/uploads/'+card.img3"
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
                  <v-col
                    class="d-flex child-flex"
                    cols="6"
                  >
                    <v-img
                      :lazy-src="card.img4.startsWith('https') ? card.img4 : this.$APP_SERVER_API+'/uploads/'+card.img4"
                      :src="card.img4.startsWith('https') ? card.img4 : this.$APP_SERVER_API+'/uploads/'+card.img4"
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
    <!-- row info 4: interest-->
        <!-- Interest -->
                <v-row>
                    <v-col cols="12" md="8">
                    <div class="text-caption pa-2 ">
                        <div class="text-grey">Biography</div>
                        <div class="text-h6 font-weight-medium">
                          <p>{{ card.bio}}</p>
                        </div>
                      </div>       
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="text-caption pa-2 ">
                          <v-combobox
                            v-model="tags"
                            label="Tags"
                            multiple
                            chips
                            readonly
                          >
                          </v-combobox>
                      </div>     
                    </v-col>
                </v-row>          
              </v-card>             
              
           
            </div>
          </v-col>
        </v-row>
  <!-- CHAT ACTIONS -->
        <v-row align="center" justify="center">
            <v-tooltip text="Report Fake Account" location="top">
            <template v-slot:activator="{ props } "> 
            <v-btn v-bind="props"
              v-on:click.prevent = "onClickReported" 
              elevation="8"
              color="black"
              icon="mdi-account-alert"
              size="small"
              alt="report"
            ></v-btn>
            </template>
            </v-tooltip> 
            <v-tooltip text="Block User" location="top">
            <template v-slot:activator="{ props } "> 
            <v-btn v-bind="props"
              v-on:click.prevent = "onClickBlocked"
              class="ma-1" 
              elevation="8"
              color="red"
              icon="mdi-cancel"
              size="small"
            ></v-btn>
            </template>
            </v-tooltip>    
            <v-tooltip text="Unlike" location="top">
            <template v-slot:activator="{ props } "> 
            <v-btn v-bind="props"
              v-if="this.to_like_check && !this.from_like_check"
              class="ma-1"
              elevation="8"
              color="red"
              icon="mdi-heart"
              size="small"
              v-on:click.prevent = "onClickUnLike" 
            ></v-btn>
            </template>
            </v-tooltip>
            <v-tooltip text="Like" location="top">
            <template v-slot:activator="{ props } "> 
            <v-btn v-bind="props"
              v-if="!this.to_like_check"
              color="white"
              icon="mdi-heart"
              size="small"
              v-on:click.prevent = "onClickLike" 
            ></v-btn>
            </template>
            </v-tooltip>
            <v-tooltip text="Unlike" location="top">
            <template v-slot:activator="{ props } "> 
            <v-btn v-bind="props"
              v-if="this.to_like_check && this.from_like_check"
              class="ma-1"
              elevation="8"
              color="orange darken-2"
              icon="mdi-infinity"
              size="large"
              v-on:click.prevent = "onClickUnLike" 
            ></v-btn>
            </template>
            </v-tooltip>
            <v-tooltip text="Unlike" location="top">
            <template v-slot:activator="{ props } ">
            <v-btn v-bind="props"
              class="ma-1"
                elevation="8"
                :color="this.from_like_check && this.to_like_check ? 'success':'grey'"
                icon="mdi-chat"
                size="small"
                :disabled="!(this.from_like_check && this.to_like_check)"
                v-on:click.prevent = "onClickChat"    
            ></v-btn>   
            </template>
            </v-tooltip>
            
            <v-tooltip text="Unlike" location="top">
            <template v-slot:activator="{ props } ">
            <v-btn v-bind="props"
              size="small" elevation="8"
              class="ma-1"
              color="purple"
              icon="mdi-location-exit"
              @click.prevent="onProfileClose"
            ></v-btn>
            </template>
            </v-tooltip>
        </v-row>  
      </v-col>
    </v-row>
</v-container>
</template>

<script >
import store from '../../store/index'
import {socket} from '../../services/socket'
import moment from 'moment'
import axios from "axios"
import Error500 from '../InternalErrorServer500.vue'
import { toast } from 'vue3-toastify';

export default {
  name: 'Chat',
  emits :{
    click_on_close:null,
    click_on_chat: null, 
    click_on_like: null, 
    click_on_unlike: null,
    click_on_blocked: null,
    click_on_reported: null
  },
  components: {
      Error500
  },
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
  data() {
	return{
        error: false,
        error_message: '',
        isLoading: false,
        to_user: null,
        online_check: false,
        to_like_check: false,
        from_like_check: false,
        tags:[],
	}
  },
  computed:{
      nb_connected_change(){
      return (store.state.connected_store.nb_connected )
      },
      nb_matched_change(){
      return (store.state.matched_store.nb_matched )
      },
      nb_blocked_change(){
      return (store.state.blocked_store.nb_blocked )
      }
  },
  watch: {
      nb_connected_change(newer,older){
        const data = store.state.connected_store.connected_uuids
        const data_filter = data.filter((item) => item[0] === this.card.uuid)
        if (data_filter.length > 0){
          this.online_check= true
        }
        else {
        this.online_check= false
        }
      },
      nb_matched_change(newer,older){
        console.log("mathced have change")
        const user= store.getters['user_store/getUser']
      const data = store.state.connected_store.connected_uuids
      const data_filter = data.filter((item) => item[0] === this.card.uuid)
      if (data_filter.length > 0){
        this.online_check= true
      }
      else {
        this.online_check= false
      }
      const data_matched = store.state.matched_store.matched_uuids
      console.log("aqui")
      console.log(data_matched)
      const data_matched_filter_from = data_matched.filter((item) => (
            console.log(item.from_uuid),console.log(item.to_uuid),
            console.log(this.card.uuid),
            (item.from_uuid === this.card.uuid && item.to_uuid === user.uuid)
            ))
      if (data_matched_filter_from.length > 0){
        this.from_like_check= true
      }
      else {
        this.from_like_check= false
      }
      const data_matched_filter_to = data_matched.filter((item) => 
            (item.to_uuid  === this.card.uuid && item.from_uuid === user.uuid)
            )
      if (data_matched_filter_to.length > 0){
        this.to_like_check= true
      }
      else {
        this.to_like_check= false
      }
      },
      nb_blocked_change(newer,older){
      console.log("blocked have change")
      const user= store.getters['user_store/getUser']
      const data = store.state.blocked_store.blocked
      console.log(data)
      const data_filter = data.filter((item) => item.to_uuid === this.card.uuid)
      if (data_filter.length > 0){
        this.$emit('click_on_close')
      }
    },
	},
  methods: {
    // inicial load of messages between user <> other 
      onProfileClose () {
        this.$emit('click_on_close')
      },
      async getMessages(){
          // delete messages in store before call database
      try {
        this.isLoading = true;
        const token = localStorage.getItem('token');
        const data = {
        }
        let axiosConfig = {
          params:{uuid1: this.user.uuid, uuid2:this.card.uuid },
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${token}`,
            //"Access-Control-Allow-Origin": "*",
          }
        };
        const response = await axios.get("/messages", axiosConfig)
          store.commit("message_store/setMessages",response.data);
          this.error = false;
          this.messages  = store.getters['message_store/getMessages']
          this.isLoading = false;	
      } catch (e) {
        console.log(e)
        this.error = true
      } finally {
        this.isLoading = false;	
      }
      },
      // Handle open chat
      onClickChat () {
        //console.log("click chat")
        if (!this.check_avatar()){
        toast("Update your profile photo to chat with "+ this.card.username, {
            autoClose: 2000,
            type: "info",
            position: "bottom-right",
          }); 
        return false
        }
        this.$emit('click_on_close')
        this.$emit('click_on_chat', this.card)
      },
      // Handle open chat
      onClickClose () {
        //console.log("click chat")
        this.$emit('click_on_close')
      },
      // Handle click like
      onClickLike () {
        //console.log("click like")
        this.$emit('click_on_like', this.card)
      },
      // Handle click unlike
      onClickUnLike () {
        //console.log("click unlike")
        this.$emit('click_on_unlike', this.card)
      },
      // Handle click blocked
      onClickBlocked () {
        console.log("click blocked")
        this.$emit('click_on_blocked', this.card)
      },
      // Handle click reported
      onClickReported () {
        console.log("click reported")
        this.$emit('click_on_reported', this.card)
      },
      // Check if have a picture in avatar necesary for chat
      check_avatar(){
        const user= store.getters['user_store/getUser']
        if (user.avatar === 'default.png'){
          return false
        }
        return true
      }
  },
  async mounted() {
    // init check online
    this.isLoading = true
    const user= store.getters['user_store/getUser']
    const data = store.state.connected_store.connected_uuids
    const data_filter = data.filter((item) => item[0] === this.card.uuid)
    console.log(data_filter)
    if (data_filter.length > 0){
            console.log("true")
            this.online_check= true
    }
    else {
          this.online_check= false
    }
    // init checking likes -> matched
    const data_matched = store.state.matched_store.matched_uuids
    const data_matched_filter_from = data_matched.filter((item) => (
          //console.log(item.from_uuid),console.log(item.to_uuid),
          //console.log(this.card.uuid),
          (item.from_uuid === this.card.uuid && item.to_uuid === user.uuid)
          ))
    if (data_matched_filter_from.length > 0){
      this.from_like_check= true
    }
    else {
      this.from_like_check= false
    }
    const data_matched_filter_to = data_matched.filter((item) => 
          (item.to_uuid  === this.card.uuid && item.from_uuid === user.uuid)
          )
    if (data_matched_filter_to.length > 0){
      this.to_like_check= true
    }
    else {
      this.to_like_check= false
    }
    // getting mate tags
    console.log("getting tags")
    const token = localStorage.getItem('matcha_token');
    try {
        let axiosConfig = {
          params:{
            uuid:  this.card.uuid
          },
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${token}`,
            //"Access-Control-Allow-Origin": "*",
          }
        };
        let data={
            
        }
        const response = await axios.get("/tags/",axiosConfig)
        console.log("response list of card tags", response.data)
        //this.items = response.data
        var i
        this.list_tags = []
      for (i = 0; i < response.data.length; i++) {
        this.tags.push(response.data[i].tag)
      }
    } catch (e) {
      console.log("error:",e)
      this.error = true
    } finally {
        this.isLoading = false;	
    }
    this.isLoading = false
  },
}
</script>
<style scoped>
.scrollable {
    overflow-y: auto;
    height: 90vh;
  }
  .header-container{
    box-sizing: border-box;
    height: calc(5rem);
    overflow-y: auto;
    padding: 0px 0px 0px 0px ;
    background-image: url("../../assets/background_board.png");
    background-size: cover;
  }
  .board-container{
    box-sizing: border-box;
    height: calc(100vh - 15rem);
    overflow-y: auto;
    padding: 0px 0px 0px 0px ;
    background-image: url("../../assets/background_board.png");
    background-size: cover;
  }

</style>