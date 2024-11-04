<template>
	<v-container >
    <v-row justify="center"  >
      <v-col cols="12" sm="5">
        <v-card 
          class="ma-auto pa-3 overflow-y-auto"
          elevation="8"
          height= "80vh"
          rounded="lg"
          color="green" 
        >
          <ResearchFilter :filter=this.filter @filter="filter_query" @filter_reset="filter_reset"></ResearchFilter>
        </v-card>
      </v-col>
      <v-col cols="12" sm="7" >
        <v-card 
          class="ma-auto pa-3"
          elevation="8"
          height= "80vh"
          rounded="lg"
          color="green" 
        >
      <div v-if="isLoading" class="loading">
      LOADING NEW MATES
      </div> 
      <div v-else >
        <!--{{this.cards.data}} _USfUAffRIOS-->
        <v-list max-height="80vh" class="overflow-y-auto list1" @scroll="onScroll">
          
          <v-list-item class="ma-0 pa-0" 
            v-for="card in cards.data"
            :key="card.uuid"
          >
          <Card :card="card" class="ma-2 pa-0"
            @click_on_chat="handleCardChat" @click_on_profile="handleCardProfile"
            @click_on_like="handleLikeCard" @click_on_unlike="handleUnlikeCard"
            @click_on_blocked="handleBlockedCard" 
            @click_on_reported="handleReportedCard"
          />
          </v-list-item>
        </v-list> 
      </div>
      </v-card>
      </v-col>
    </v-row>
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
        <Chat :card="this.card_choosen" :user="this.user" />
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
            :card="this.card_choosen" :user="this.user" />
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import axios from "axios"
import store from '../store/index'
import {socket} from '../services/socket'
import moment from 'moment'
import router from '../router'
import ResearchFilter from './subcomponents/ResearchFilter.vue'
import Chat from './subcomponents/Chat.vue'
import Profile from './subcomponents/Profile.vue'
import Card from './subcomponents/Card.vue'
import { toast } from 'vue3-toastify';

export default {
  name: 'GalleryView',
  components: {
    ResearchFilter,
    Chat,
    Profile,
    Card
  },
  props: {
    },
	data() {
		return{
      user: null,
			isLoading: true, // Toggles the loading overlay
			error: false,
			cards: { data: null, index: 0, max: 10 },
			cards_left: 10,
			card_choosen: null,
      page: 0,
      filter: { age:[18,100], distance:[0,500],tags:[0,3],rating:[0,5],orderId:2, gender:"*",sexual:"*" },
			showChatModal: false,
      showProfileModal: false,
	  	}
  },
  setup() {
  },
  methods: {
    // handle new query button
    filter_query(payload) {
      console.log("recibing emiting from filter",payload)
      // Change filter
      // reset to aply new query
      this.cards= { data: null, index: 0, max: 5 },
			this.cards_left= 5,
			this.card_choosen= null,
      this.page= 0,
      this.filter.age = payload[0]
      this.filter.distance = payload[1]
      this.filter.tags = payload[2]
      this.filter.rating = payload[3]
      this.filter.orderId = payload[4]
      this.filter.gender = payload[5]
      this.filter.sexual = payload[6]
      this.getData()
       
    },
    // handle reset query button
    filter_reset(payload) {
      console.log("recibing emiting from filter",payload)
      // Change filter
      // reset to aply new query
      this.cards= { data: null, index: 0, max: 5 },
			this.cards_left= 5,
			this.card_choosen= null,
      this.page= 0,
      this.filter= { age:[18,60], distance:[0,1000],tags:[0,3],rating:[0,5], orderId:2, gender:"*", sexual:"*"},
      this.getData()
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
    // handle user profile button
    handleCardProfile(payload) {
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
      socket.emit('notifications',data)

      this.card_choosen = payload


      this.toggleProfile()
    },
    toggleProfile(){
      this.showProfileModal ? this.showProfileModal = false: this.showProfileModal = true
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
    // get cards data
    async getData() {       
      const { cards } = this;
      cards.data = null;
      try {
        this.isLoading = true;
        console.log("loading data")
        // Get a random list of people from database
        const token = localStorage.getItem('matcha_token');
        const where_rating = ' (`rating` >='+this.filter.rating[0]*this.$RATING+' and `rating`<='+this.filter.rating[1]*this.$RATING+') '
        const where_age = ' (CAST((DATEDIFF(CURRENT_DATE(),`date`)/365) AS SIGNED) >= '+this.filter.age[0]+' AND CAST((DATEDIFF(CURRENT_DATE(),`date`)/365) AS SIGNED) <= '+this.filter.age[1]+') '
        const where_distance = '(st_distance_sphere(POINT(`longitude`,`latitude`), POINT('+this.user.longitude+','+this.user.latitude+'))/1000 >= ' +this.filter.distance[0]+' AND st_distance_sphere(POINT(`longitude`,`latitude`), POINT('+this.user.longitude+','+this.user.latitude+'))/1000 <= ' +this.filter.distance[1]+') '
        let where_gender =""
        if (this.filter.gender==='*'){
          where_gender=''
        } else {
          where_gender=' AND `gender`="'+this.filter.gender+'"'
        }
        let where_sexual=""
        if (this.filter.sexual==='*'){
          where_sexual=''
        } else {
          where_sexual=' AND `sexual`="'+this.filter.sexual+'"'
        }
        
        const where_no_current_user = ' (`uuid` <> "'+ this.user.uuid+'") '
        const where_no_blocked = ' (`uuid` NOT IN ( SELECT to_uuid FROM blocked WHERE from_uuid="' + this.user.uuid+'")) '
        
        const where_clause = where_age 
                            + ' AND ' + where_rating 
                            + ' AND ' + where_distance 
                            + where_gender
                            + where_sexual
                            + ' AND ' + where_no_current_user 
                            + ' AND ' + where_no_blocked

        // clause for bring distance
        const select_distance = 'st_distance_sphere(POINT(`longitude`,`latitude`), POINT('+this.user.longitude+','+this.user.latitude+'))/1000 AS distance, CAST((DATEDIFF(CURRENT_DATE(),`date`)/365) AS SIGNED) AS age'
        let order_clause = '';
        console.log("this.filter", this.filter)
        if (this.filter.orderId === 1){
          order_clause= ' CAST((DATEDIFF(CURRENT_DATE(),`date`)/365) AS SIGNED) asc'
        } else if (this.filter.orderId  === 2){
          order_clause = ' (st_distance_sphere(POINT(`longitude`,`latitude`), POINT('+this.user.longitude+','+this.user.latitude+'))/1000) asc' 
        } else if (this.filter.orderId  === 3){
          order_clause = ' `common_tags` desc'
        } else if (this.filter.orderId  === 4){
          order_clause = ' `rating` desc'
        }
        console.log("this.filter order", order_clause)
        const data = {
									'page': this.page,
                  'limit': this.cards_left,
                  'select_clause': select_distance,
                  'where_clause': where_clause,
                  'order_clause': order_clause,
                  'limit_tags': this.filter.tags,
                  'user_uuid': this.user.uuid
                }
        let axiosConfig = {
          params:{id: "puff"},
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${token}`,
            //"Access-Control-Allow-Origin": "*",
          }
        };
        //console.log(data)
        //console.log(where_age + ' and ' + where_rating + ' and ' + where_distance + ' and ' + where_no_current_user + ' and ' + where_no_blocked)
        const response = await axios.post("/cards", data,axiosConfig)
          console.log("response from cards new data", response.data)
          this.error = false;
          //console.log("new data", response.data)
          this.cards.data = response.data;
          this.cards.index = 0;
          this.isLoading = false;	
          //console.log("new data", this.cards.data)
        // Get a random list of people from web
        /*
        fetch(`https://randomuser.me/api/?results=${cards.max}`)
        .then(async (response) => {
          const { results } = await response.json();
          const data = results.map(({ name, picture, login }) => ({
            name: `${name.first} ${name.last}`,
            picture: picture.large,
            rating: Math.floor(Math.random() * 5 + 1),
            approved: null,
            uuid: login.uuid
          }));
          setTimeout(() => {
            cards.data = data;
            cards.index = 0;
            this.isLoading = false;	
          }, 500);
        });
        */
      } catch (e) {
        console.log("herere")
        this.error = true
      } finally {
        this.isLoading = false;	
      }
	  },
    // handle click outside chat/profile pop up to close pending...
    handleClickOutside(event) {
      console.log(event.target)
      try {
      let answer = document.getElementById("chat_board").contains(event.target)
      console.log(answer)
      } catch {}
      try {
      if (!this.$refs.element_chat.contains(event.target)) {
        // Click occurred outside the element
        console.log("oook")
        //this.toggleChat()
      }}
      catch{}
    },
    // handle finish scroll load new cards
    async onScroll(e) {
      const { scrollTop, offsetHeight, scrollHeight } = e.target
      if ((scrollTop + offsetHeight) >= scrollHeight) {
        console.log('bottom!')
        this.isLoading = true;
        const token = localStorage.getItem('matcha_token');
        let axiosConfig = {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${token}`,
            //"Access-Control-Allow-Origin": "*",
          }
        };
        this.page = this.page + 1
        this.cards_left = this.cards.max
        try { 
          this.getData()
          this.cards.index = 0;
          this.cards_left = this.cards.max
        } catch (e) {
          console.log("herere")
          this.error = true
        } finally {
          this.isLoading = false;	
        }
        /*
        const where_rating = ' (`rating` >='+this.filter.rating[0]+' and `rating`<='+this.filter.rating[1]+') '
        const where_age = ' (CAST((DATEDIFF(CURRENT_DATE(),`date`)/365) AS SIGNED) >= '+this.filter.age[0]+' AND CAST((DATEDIFF(CURRENT_DATE(),`date`)/365) AS SIGNED) <= '+this.filter.age[1]+') '
        console.log(this.user.longitude, this.user.latitude)
        const where_no_current_user = ' (`uuid` <> "'+ this.user.uuid+'") '
        const where_no_blocked = ' (`uuid` NOT IN ( SELECT to_uuid FROM blocked WHERE from_uuid="' + this.user.uuid+'")) '
        const where_distance = '(st_distance_sphere(POINT(`longitude`,`latitude`), POINT('+this.user.longitude+','+this.user.latitude+'))/1000 >= ' +this.filter.distance[0]+' AND st_distance_sphere(POINT(`longitude`,`latitude`), POINT('+this.user.longitude+','+this.user.latitude+'))/1000 <= ' +this.filter.distance[1]+') '
        const select_distance = ',st_distance_sphere(POINT(`longitude`,`latitude`), POINT('+this.user.longitude+','+this.user.latitude+'))/1000 AS distance'
        let order_clause = '';
        console.log("this.filter", this.filter)
        if (this.filter.orderId === 1){
          order_clause= ' CAST((DATEDIFF(CURRENT_DATE(),`date`)/365) AS SIGNED) asc'
        } else if (this.filter.orderId  === 2){
          order_clause = ' (st_distance_sphere(POINT(`longitude`,`latitude`), POINT('+this.user.longitude+','+this.user.latitude+'))/1000) asc' 
        } else if (this.filter.orderId  === 3){
          order_clause = ' `tags` desc'
        } else if (this.filter.orderId  === 4){
          order_clause = ' `rating` desc'
        }
        const data = {
					'page': this.page,
          'limit': this.cards_left,
          'select_clause': select_distance,
          'where_clause': where_age + ' and ' + where_rating + ' and ' + where_distance + ' and ' + where_no_current_user + ' and ' + where_no_blocked,
           'order_clause': order_clause,
        }
        console.log("new data0")
        try {
          console.log("new data")
          const response = await axios.post("/cards", data,axiosConfig)
          console.log("new data")
          // need token and query
          this.cards.data = response.data;
          this.cards.index = 0;
          this.cards_left = this.cards.max 
        } catch (e) {
        console.log("herere")
        this.error = true
        } finally {
          this.isLoading = false;	
        }
        */
    }
}
  },
  mounted() {
    this.user = store.getters['user_store/getUser']
    this.getData();
    // add a listener to detect click for outside component
    document.addEventListener('click', this.handleClickOutside);
	},
  beforeUnmount() {
    // remove listener
    document.removeEventListener('click', this.handleClickOutside);
  },
  
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.flex-container{ 
  display: flex;
  width: 100vw;
	height: 100vh;
  background-color: #774b4b;
}
.container1{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 5em 0 0 0;
  background-color: rgba(0, 0, 0, 0.5);
}
.filter {
  flex-grow: 1;
  background-color: DodgerBlue;
  color: white;
  width: 100px;
  margin: 10px;
  text-align: center;
  line-height: 75px;
  font-size: 20px;
}
.filter1 {
  background-color: rgb(44, 66, 90);
  margin: auto;
  height: 100%;
  padding: 7px 8px 1px;
  color: white;
}
.results1 {
  background-color: rgb(62, 103, 150);
  margin: 0px;
  padding: 6px
}
.list1 {
  background-color: rgb(6, 47, 94);
  margin: 0px;
  padding: 0px;
}
.results {
  flex-grow: 3;
  justify-content: center;
  background-color: rgb(154, 163, 173);
  color: white;
  width: 100px;
  margin: 10px;
  text-align: center;
  line-height: 75px;
  font-size: 10px;
}
.modal_mask_chat{
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal_mask_profile{
  position: fixed;
  z-index: 8888;
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
.profile{
  position: absolute;
  left: 0px;
  top: 0px;
  z-index: 100;
  width: 100vw;
	height: 100vh;
  background-color: rgb(101, 101, 101);
  opacity: 0.5
}


</style>