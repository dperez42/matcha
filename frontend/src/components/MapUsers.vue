<template>
    <v-card class="mx-auto my-0 pa-0"
    color="primary"
    elevation="16"
    width="100vw"
    height="100vh">
        <mymap :user="user_data" @click_on_profile="handleCardProfile"/>
    </v-card>
<!--pop up chat--->
  <div v-if="showChatModal === true" class="modal_mask_chat">
    <div class="modal_body" ref="element_chat" id="chat_board">
      <div>
        <v-row class="d-flex justify-space-between ma-1 mb-4">
          <span class="text-h4 text-white"> CHAT </span>  
            <v-btn size="small" elevation="8"
              class=""
              color="purple"
              icon="mdi-location-exit"
               @click.prevent="toggleChat()"
            ></v-btn>
        </v-row>
      </div>
      <div class="modal-body" >
        <Chat :card="this.card_choosen" :user="this.user_data" />
      </div>
    </div>
  </div>
<!--pop up profile--->
  <div v-if="showProfileModal === true" class="modal_mask_chat">
    <div class="modal_body" ref="element_chat">
      <div class="modal-body">
        <Profile @click_on_close="toggleProfile()" 
            @click_on_chat="handleCardChat" 
            @click_on_like="handleLikeCard" 
            @click_on_unlike="handleUnlikeCard"
            @click_on_blocked="handleBlockedCard" 
            @click_on_reported="handleReportedCard"
            :card="this.card_choosen" :user="this.user_data" />
      </div>
    </div>
  </div>
</template>

<script>
import store from '../store/index'
import mymap from './subcomponents/Map.vue'
import axios from "axios"
import moment from 'moment'
import {socket} from '../services/socket'
import Profile from './subcomponents/Profile.vue'
import { toast } from 'vue3-toastify';
import Chat from './subcomponents/Chat.vue'
import "leaflet/dist/leaflet.css";
import * as L from 'leaflet';
import Error_500 from './InternalErrorServer500.vue'

export default {
  name: 'HelloWorld',
  components: {
    mymap,
    Profile,
    Chat,
    Error_500
  },
  data: () => ({
    error: false,
		error_message: "",
    user_data: store.getters['user_store/getUser'],
    card_choosen: null,
    showProfileModal: false,
    showChatModal: false,
  }),
  async mounted() {
	},
  methods:{
    // handle user profile button
    async handleCardProfile(payload) {
      if (import.meta.env.VITE_DEBUG==='true'){console.log("info: handleCardProfile",payload)}
      if (import.meta.env.VITE_DEBUG==='true'){console.log("info: Emit view profile",payload)}
      // get actual user
      const user = store.getters['user_store/getUser']
      // get profile 
      // get card data 
      const token = localStorage.getItem('matcha_token');
      // config axios
      const axiosConfig = {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              'Authorization': `Bearer ${token}`,
              //"Access-Control-Allow-Origin": "*",
            }  
      }
      const data1 = {
				'page': 0,
        'limit': 10,
        'where_clause': ' uuid ="'+payload+'"',
        'order_clause':  ' `uuid` desc',
        'user_uuid':  this.user_data.uuid
      }
      const response = await axios.post("/cards", data1,axiosConfig)
      if (import.meta.env.VITE_DEBUG==='true'){console.log("info: Loaded card",response)}
      this.card_choosen = response.data[0]
    // calculate distance ang Age
      var firstDate = moment(this.card_choosen.date, 'YYYY-MM-DD')
      var sDate = moment.utc().utcOffset(+2).format("YYYY/MM/DD")
      var secondDate = moment(sDate, 'YYYY-MM-DD')
      var duration = moment.duration(secondDate.diff(firstDate));
      var years = duration.asYears(); 
      this.card_choosen.age = parseInt(years) 
    // calculate distance
      var markerFrom = L.marker([this.card_choosen.latitude,this.card_choosen.longitude])
      var markerTo = L.marker([this.user_data.latitude,this.user_data.longitude])
      var from = markerFrom.getLatLng();
      var to = markerTo.getLatLng();
      this.card_choosen.distance= (from.distanceTo(to)).toFixed(0)/1000
    // Create msg for notification
      const DateTime = moment.utc().utcOffset(+2).format("YYYY/MM/DD HH:mm:ss")
      const profile_msg = {
        command:  'viewed',
        from_uuid: user.uuid,
        from_username: user.username,
        to_username: this.card_choosen.username,
        to_uuid: this.card_choosen.uuid,
        message: 'this is a profile view',
        timestamp: DateTime
      }  
      // send message
      socket.emit('notifications',profile_msg)
      // toggle to profile
      this.toggleProfile()
    },
    toggleProfile(){
      this.showProfileModal ? this.showProfileModal = false: this.showProfileModal = true
    },
   // handle user chat button
    handleCardChat(payload) {
      if (import.meta.env.VITE_DEBUG==='true'){console.log("info: handle Card Chat. ", payload)}
      this.card_choosen = payload
      //alert(this.card_choosen)
      this.toggleChat()
    },
    toggleChat(){
      this.showChatModal ? this.showChatModal = false: this.showChatModal = true
    },
    // handle liked card
    async handleLikeCard(payload) {
       if (import.meta.env.VITE_DEBUG==='true'){console.log("info: handle like. ", payload)}
      const user = store.getters['user_store/getUser']
      const DateTime = moment.utc().utcOffset(+2).format("YYYY/MM/DD HH:mm:ss")
      const data = {
        command:  'liked',
        from_uuid: user.uuid,
        from_username: user.username,
        to_username: payload.username,
        to_uuid: payload.uuid,
        message: 'this is a like',
        timestamp: DateTime
      }    
      // because de message not came back ... add from store
      store.commit("matched_store/addLike",data)  
      socket.emit('matched',data)
      // check is there a match----------------------------------------------
      const like_list= await store.getters['matched_store/getMatched']
      var i
      var to = false
      var from = false
      for (i=0; i< like_list.length;i++) {
          if (like_list[i].to_uuid === user.uuid && like_list[i].from_uuid === data.to_uuid){
            to = true
          }
          if (like_list[i].from_uuid === user.uuid && like_list[i].to_uuid === data.to_uuid){
            from = true
          }
      }
      if (to && from){
        toast(data.to_username + " matched")
      }
    },
    // handle unlike  card
    async handleUnlikeCard(payload) {
      if (import.meta.env.VITE_DEBUG==='true'){console.log("info: handle unlike Card. ", payload)}
      const user = store.getters['user_store/getUser']
      const DateTime = moment.utc().utcOffset(+2).format("YYYY/MM/DD HH:mm:ss")
      const data = {
        command:  'unliked',
        from_uuid: user.uuid,
        from_username: user.username,
        to_username: payload.username,
        to_uuid: payload.uuid,
        message: 'this is an unlike',
        timestamp: DateTime
      }
      store.commit("matched_store/delLike",data) 
      socket.emit('matched',data)
      // because de message not came back ... delete from store

    },
    // handle blocked card
    async handleBlockedCard(payload){
       if (import.meta.env.VITE_DEBUG==='true'){console.log("info: handle Blocked Card. ", payload)}
      const user = store.getters['user_store/getUser']
      const DateTime = moment.utc().utcOffset(+2).format("YYYY/MM/DD HH:mm:ss")
      const data = {
        command:  'blocked',
        from_uuid: user.uuid,
        from_username: user.username,
        to_username: payload.username,
        to_uuid: payload.uuid,
        message: 'this is a block',
        timestamp: DateTime
      }
      store.commit("blocked_store/addBlocked",data) 
      socket.emit('notifications',data)
    },
    // handle reported card
    handleReportedCard(payload){
       if (import.meta.env.VITE_DEBUG==='true'){console.log("info: handle Reported Card. ", payload)}
      const user = store.getters['user_store/getUser']
      const DateTime = moment.utc().utcOffset(+2).format("YYYY/MM/DD HH:mm:ss")
      const data = {
        command:  'report',
        from_uuid: user.uuid,
        from_username: user.username,
        to_username: payload.username,
        to_uuid: payload.uuid,
        message: 'Reported as fake account',
        timestamp: DateTime
      }
      toast("You have report this user as fake account.", {
            autoClose: 2000,
            type: "error",
            position: "bottom-right",
          }); 
      socket.emit('notifications',data)
    },
  },
  computed:{
  }, 
  watch: {
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.modal_mask_chat{
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal_body{
  /*position: absolute;
  inset: 50px;*/
  width: 90%;
  height: 90%;
  margin: 20px auto 20px auto;
  padding: 10px 10px;
  background-color: rgb(163, 158, 158);
  border-radius: 12px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.33);  
}
</style>
