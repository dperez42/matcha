<template>
  <v-container flex>
    <v-card class="mx-auto my-5 pa-0"
    color="primary"
    elevation="16"
    width="100vw"
    height="100vh">
        <mymap :user="user_data" @click_on_profile="handleCardProfile"/>
    </v-card>
  </v-container>
<!--pop up chat--->
  <div v-if="showChatModal === true" class="modal_mask_chat">
    <div class="modal_body" ref="element_chat" id="chat_board">
      <div class="modal-header">
        <v-row  align="center" >
          <v-col cols="8" sm="10" class="text-h4 text-white">
            CHAT
          </v-col>
          <v-col cols="4" sm="2">
            <v-btn size="x-small" elevation="8"
              class="ma-2"
              color="purple"
              icon="mdi-location-exit"
               @click.prevent="toggleChat()"
            ></v-btn>
          </v-col>
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
export default {
  name: 'HelloWorld',
  components: {
    mymap,
    Profile,
    Chat,
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
      console.log("handleCardProfile",payload);
      console.log("Emit view profile",payload);
      const user = store.getters['user_store/getUser']
      const DateTime = moment.utc().utcOffset(+2).format("YYYY/MM/DD HH:mm:ss")
      const data = {
        command:  'viewed',
        from_uuid: user.uuid,
        from_username: user.username,
        to_username: payload.username,
        to_uuid: payload.uuid,
        message: 'this is a profile view',
        timestamp: DateTime
      }  
      //socket.emit('notifications',data)
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
      console.log(response)
      this.card_choosen = response.data[0]
      this.toggleProfile()
    },
    toggleProfile(){
      this.showProfileModal ? this.showProfileModal = false: this.showProfileModal = true
    },
   // handle user chat button
    handleCardChat(payload) {
      console.log("handleCardChat",payload);
      this.card_choosen = payload
      //alert(this.card_choosen)
      this.toggleChat()
    },
    toggleChat(){
      this.showChatModal ? this.showChatModal = false: this.showChatModal = true
      console.log("change show Chat",this.showChatModal)
    },
    // handle liked card
    async handleLikeCard(payload) {
      //console.log("handleCardAccepted",payload);
      console.log("Emit card like",payload);
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
      console.log("handleCardRejected",payload);
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
      console.log("blocked card")
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
      console.log("reported card")
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
