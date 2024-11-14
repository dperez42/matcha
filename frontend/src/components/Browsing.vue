<template>
  <v-container id="browsing" fluid class="overflow-y-auto container1">     
     <v-row  >     
        <v-col cols="12" sm="7"> 
          <v-card 
            class=""
            elevation="8"
            rounded="lg"
            color="green" 
            height="80vh"
          >
       <div v-if="isLoading" >
          LOADING NEW MATES... wait
        </div> 
        <div v-if ="error">
          <Error_500 :error="this.error_message"/>
        </div> 
        <div v-if ="isLoading===false && error===false" id="card_stack" class="pa-2" >
          <CardsStack :cards="cards"
            @click_on_blocked="handleBlockedCard"
            @click_on_reported="handleReportedCard"
            @click_on_chat="handleCardChat"
            @click_on_profile="handleCardProfile"
            @click_on_like="handleCardLike"
            @click_on_unlike="handleCardUnlike"
            @hideCard="removeCardFromDeck"
          />
          </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="5"> 
          <v-card 
            class="ma-auto pa-3 overflow-y-auto"
            elevation="8"
            rounded="lg"
            color="green" 
            height="80vh"
          >
          <ResearchFilter :filter=this.filter @filter="filter_query" @filter_reset="filter_reset"></ResearchFilter>
          </v-card>
        </v-col>
     </v-row>
  </v-container>
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
        <Chat :card="this.card_choosen" :user="this.user" />
      </div>
    </div>
  </div>
    <!--pop up profile--->
  <div v-if="showProfileModal === true" class="modal_mask_chat">
    <div class="modal_body" ref="element_chat" id="profile_board">
      <div class="modal-body">
        <Profile @click_on_close="toggleProfile()" 
            @click_on_chat="handleCardChat" 
            @click_on_like="handleCardLike" 
            @click_on_unlike="handleCardUnlike"
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
import ResearchFilter from './subcomponents/ResearchFilter1.vue'
import Chat from './subcomponents/Chat.vue'
import Profile from './subcomponents/Profile.vue'
import Card from './subcomponents/Card.vue'
import CardsStack from './subcomponents/CardsStack.vue'
import { toast } from 'vue3-toastify';
import Error_500 from './InternalErrorServer500.vue'

export default {
  name: 'GalleryView',
  components: {
    ResearchFilter,
    Chat,
    Profile,
    Card,
    CardsStack,
    Error_500
  },
  props: {
    },
	data() {
		return{
      user: null,
			isLoading: true, // Toggles the loading overlay
			error: false,
      error_message: "",
			cards: { data: null, index: 0, max: 10 },
			cards_left: 10,
			card_choosen: null,
      page: 0,
      filter: { age:[18,100], distance:[0,50],tags:[0,3],rating:[0,5],orderId:4, gender:"*",sexual:"*" },
			showChatModal: false,
      showProfileModal: false,
	  	}
  },
  setup() {
  },
  methods: {
        // handle new query button
    filter_query(payload) {
      if (import.meta.env.VITE_DEBUG==='true'){console.log("info:recibing emiting from filter. ",payload)}
      // Change filter
      // reset to aply new query
      this.cards= { data: null, index: 0, max: 15 },
			this.cards_left= 15,
			this.card_choosen= null,
      this.page= 0,
      this.filter.age = payload[0]
      this.filter.distance = payload[1]
      this.filter.tags = payload[2]
      this.filter.rating = payload[3]
      this.filter.orderId = payload[4]
      this.getData_filter()
       
    },
    // handle reset query button
    filter_reset(payload) {
      if (import.meta.env.VITE_DEBUG==='true'){console.log("info: ecibing emiting from filter. ",payload)}
      // Change filter
      // reset to aply new query
      this.cards= { data: null, index: 0, max: 15 },
			this.cards_left= 15,
			this.card_choosen= null,
      this.page= 0,
      this.filter= { age:[18,100], distance:[0,50],tags:[0,3],rating:[0,5], orderId:4, gender:"*", sexual:"*"},
      this.getData()
    },
    // Handle remove from deck
    async removeCardFromDeck() {
      this.cards.data.shift();
      //console.log("removeCardFromDeck");
      this.cards_left = this.cards_left - 1
      //console.log(this.cards_left)
      if (this.cards_left === 0) {
        this.isLoading = true;
        this.page = this.page + 1
        this.cards_left = this.cards.max
        try { 
          this.getData()
          this.cards.index = 0;
          this.cards_left = this.cards.max
        } catch (e) {
          //console.log("herere")
          this.error = true
        } finally {
          this.isLoading = false;	
        }
      }
    },
    // handle user chat button
    handleCardChat(payload) {
      if (import.meta.env.VITE_DEBUG==='true'){console.log("info: Emit card chat. ",payload)}
      this.card_choosen = payload
      //alert(this.card_choosen)
      this.toggleChat()
    },
    toggleChat(){
      this.showChatModal ? this.showChatModal = false: this.showChatModal = true
    },
    // handle user profile button
    handleCardProfile(payload) {
      if (import.meta.env.VITE_DEBUG==='true'){console.log("info: Emit card view profile. ",payload)}
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
    async handleCardLike(payload) {
      if (import.meta.env.VITE_DEBUG==='true'){console.log("info: Emit card like. ",payload)}
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
    async handleCardUnlike(payload) {
      if (import.meta.env.VITE_DEBUG==='true'){console.log("info: Emit card unlike. ",payload)}
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
      if (import.meta.env.VITE_DEBUG==='true'){console.log("info: Emit card blocked. ",payload)}
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
      toast("You have blocked "+data.to_username, {
            autoClose: 2000,
            type: "error",
            position: "bottom-right",
          }); 
    },
    // handle reported card
    handleReportedCard(payload){
      if (import.meta.env.VITE_DEBUG==='true'){console.log("info: Emit card repoted. ",payload)}
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
    // get cards data, first load
    async getData() {  
      var have_mates = 0; 
      var reach_distance = false;
      const { cards } = this;
      cards.data = null;
      // integillent seach by age +-5 years of my age (initial)
              // calculate my age
            var firstDate = moment(this.user.date, 'YYYY-MM-DD')
            var sDate = moment.utc().utcOffset(+2).format("YYYY/MM/DD")
            var secondDate = moment(sDate, 'YYYY-MM-DD')
            var duration = moment.duration(secondDate.diff(firstDate));
            var years = duration.asYears(); 
            var my_age = parseInt(years) 
            this.filter.age[0]=my_age-5
            this.filter.age[1]=my_age+5
      try {
while (have_mates < 9){
        this.isLoading = true;
        // Get a random list of people from database
        const token = localStorage.getItem('matcha_token');
      // integillent seach by rating 2-5 stars (initial)
        const where_rating = ' (`rating` >='+this.filter.rating[0]*this.$RATING+' and `rating`<='+this.filter.rating[1]*this.$RATING+') '
      
      
        const where_age = ' (CAST((DATEDIFF(CURRENT_DATE(),`date`)/365) AS SIGNED) >= '+this.filter.age[0]+' AND CAST((DATEDIFF(CURRENT_DATE(),`date`)/365) AS SIGNED) <= '+this.filter.age[1]+') '
        
      // integillent search by distance less than 50 kms (initial)
        const where_distance = '(st_distance_sphere(POINT(`longitude`,`latitude`), POINT('+this.user.longitude+','+this.user.latitude+'))/1000 >= ' +this.filter.distance[0]+' AND st_distance_sphere(POINT(`longitude`,`latitude`), POINT('+this.user.longitude+','+this.user.latitude+'))/1000 <= ' +this.filter.distance[1]+') '
        let where_gender =""
      
      // intelligent seach by is gender and sexual orientation
       if (this.user.gender === 'Male' && this.user.sexual === 'Heterosexual' ){
         where_gender=' AND `gender`="Female" AND (`sexual`="Hetereosexual" OR `sexual`="Bisexual") '
       }
       if (this.user.gender === 'female' && this.user.sexual === 'Heterosexual' ){
         where_gender=' AND `gender`="Male" AND (`sexual`="Hetereosexual" OR `sexual`="Bisexual") '
       }
       if (this.user.gender === 'Male' && this.user.sexual === 'Homosexual' ){
         where_gender=' AND `gender`="Male" AND (`sexual`="Homosexual" OR `sexual`="Bisexual") '
       }
       if (this.user.gender === 'Female' && this.user.sexual === 'Homosexual' ){
         where_gender=' AND `gender`="Female" AND (`sexual`="Homosexual" OR `sexual`="Bisexual") '
       }
       if (this.user.gender === 'Male' && this.user.sexual === 'Bisexual' ){
         where_gender=' AND ((`gender`="Male" AND (`sexual`="Homosexual" OR `sexual`="Bisexual")) OR  (`gender`="Female" AND (`sexual`="Heterosexual" OR `sexual`="Bisexual")))'
       }
       if (this.user.gender === 'Female' && this.user.sexual === 'Bisexual' ){
         where_gender=' AND ((`gender`="Female" AND (`sexual`="Homosexual" OR `sexual`="Bisexual")) OR  (`gender`="Male" AND (`sexual`="Heterosexual" OR `sexual`="Bisexual")))'
       }

      // is not blocked and is not me
        const where_no_current_user = ' (`uuid` <> "'+ this.user.uuid+'") '
        const where_no_blocked = ' (`uuid` NOT IN ( SELECT to_uuid FROM blocked WHERE from_uuid="' + this.user.uuid+'")) '      
        const where_clause = where_age 
                            + ' AND ' + where_rating 
                            + ' AND ' + where_distance 
                            + where_gender
                            + ' AND ' + where_no_current_user 
                            + ' AND ' + where_no_blocked

        // clause for bring distance
        const select_distance = 'st_distance_sphere(POINT(`longitude`,`latitude`), POINT('+this.user.longitude+','+this.user.latitude+'))/1000 AS distance, CAST((DATEDIFF(CURRENT_DATE(),`date`)/365) AS SIGNED) AS age'
        let order_clause = '';
      
      // choose order for distance (initial)
        if (this.filter.orderId === 1){
          order_clause= ' CAST((DATEDIFF(CURRENT_DATE(),`date`)/365) AS SIGNED) asc'
        } else if (this.filter.orderId  === 2){
          order_clause = ' (st_distance_sphere(POINT(`longitude`,`latitude`), POINT('+this.user.longitude+','+this.user.latitude+'))/1000) asc' 
        } else if (this.filter.orderId  === 3){
          order_clause = ' `common_tags` desc'
        } else if (this.filter.orderId  === 4){
          order_clause = ' `rating` desc'
        }
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
          this.cards.data = response.data;
          if (this.cards.data.length===0){
            this.error=true
            this.error_message = {code:0, msg:"Oops.... no mates found. Trying a new search.", error:' '}
          }
          have_mates = this.cards.data.length
        // changing limitis filter
        // first by distance
          if ((this.filter.distance[0]-5)<0){this.filter.distance[0]=0}else {this.filter.distance[0]=this.filter.distance[0]-5}
          if ((this.filter.distance[1]+5)>300){this.filter.distance[1]=300; reach_distance=true}
          else {this.filter.distance[1]=this.filter.distance[1]+5}
          //console.log(this.filter.distance)
          if (reach_distance===true){
            if ((this.filter.age[0]-5)<18){this.filter.age[0]=18}else {this.filter.age[0]=this.filter.age[0]-5}
            if ((this.filter.age[1]+5)>100){this.filter.age[1]=100}else {this.filter.age[1]=this.filter.age[1]+5}
          }
          //console.log(this.filter.age)
}   
          this.error = false;
          //console.log("new data", response.data)
          this.cards.index = 0;
          this.isLoading = false;	
//
        
      } 
      catch (e) {
        if (import.meta.env.VITE_DEBUG==='true'){console.log("error: Getting Cards.",e)}
        this.error = true
        this.error_message = {code:500, msg:"Oops.... Something happen in server. Try Later", error:e}
      } 
      finally {
        this.isLoading = false;	
      }
	  },
    // get cards data
    async getData_filter() {  
      const { cards } = this;
      cards.data = null;
      try {

        this.isLoading = true;
        // Get a random list of people from database
        const token = localStorage.getItem('matcha_token');
      // integillent seach by rating 2-5 stars (initial)
        const where_rating = ' (`rating` >='+this.filter.rating[0]*this.$RATING+' and `rating`<='+this.filter.rating[1]*this.$RATING+') '   
        const where_age = ' (CAST((DATEDIFF(CURRENT_DATE(),`date`)/365) AS SIGNED) >= '+this.filter.age[0]+' AND CAST((DATEDIFF(CURRENT_DATE(),`date`)/365) AS SIGNED) <= '+this.filter.age[1]+') '
        
      // integillent search by distance less than 50 kms (initial)
        const where_distance = '(st_distance_sphere(POINT(`longitude`,`latitude`), POINT('+this.user.longitude+','+this.user.latitude+'))/1000 >= ' +this.filter.distance[0]+' AND st_distance_sphere(POINT(`longitude`,`latitude`), POINT('+this.user.longitude+','+this.user.latitude+'))/1000 <= ' +this.filter.distance[1]+') '
        let where_gender =""
      // intelligent seach by is gender and sexual orientation
       if (this.user.gender === 'Male' && this.user.sexual === 'Heterosexual' ){
         where_gender=' AND `gender`="Female" AND (`sexual`="Hetereosexual" OR `sexual`="Bisexual") '
       }
       if (this.user.gender === 'female' && this.user.sexual === 'Heterosexual' ){
         where_gender=' AND `gender`="Male" AND (`sexual`="Hetereosexual" OR `sexual`="Bisexual") '
       }
       if (this.user.gender === 'Male' && this.user.sexual === 'Homosexual' ){
         where_gender=' AND `gender`="Male" AND (`sexual`="Homosexual" OR `sexual`="Bisexual") '
       }
       if (this.user.gender === 'Female' && this.user.sexual === 'Homosexual' ){
         where_gender=' AND `gender`="Female" AND (`sexual`="Homosexual" OR `sexual`="Bisexual") '
       }
       if (this.user.gender === 'Male' && this.user.sexual === 'Bisexual' ){
         where_gender=' AND ((`gender`="Male" AND (`sexual`="Homosexual" OR `sexual`="Bisexual")) OR  (`gender`="Female" AND (`sexual`="Heterosexual" OR `sexual`="Bisexual")))'
       }
       if (this.user.gender === 'Female' && this.user.sexual === 'Bisexual' ){
         where_gender=' AND ((`gender`="Female" AND (`sexual`="Homosexual" OR `sexual`="Bisexual")) OR  (`gender`="Male" AND (`sexual`="Heterosexual" OR `sexual`="Bisexual")))'
       }

      // is not blocked and is not me
        const where_no_current_user = ' (`uuid` <> "'+ this.user.uuid+'") '
        const where_no_blocked = ' (`uuid` NOT IN ( SELECT to_uuid FROM blocked WHERE from_uuid="' + this.user.uuid+'")) '      
        const where_clause = where_age 
                            + ' AND ' + where_rating 
                            + ' AND ' + where_distance 
                            + where_gender
                            + ' AND ' + where_no_current_user 
                            + ' AND ' + where_no_blocked

        // clause for bring distance
        const select_distance = 'st_distance_sphere(POINT(`longitude`,`latitude`), POINT('+this.user.longitude+','+this.user.latitude+'))/1000 AS distance, CAST((DATEDIFF(CURRENT_DATE(),`date`)/365) AS SIGNED) AS age'
        let order_clause = '';
      
      // choose order for distance (initial)
        if (this.filter.orderId === 1){
          order_clause= ' CAST((DATEDIFF(CURRENT_DATE(),`date`)/365) AS SIGNED) asc'
        } else if (this.filter.orderId  === 2){
          order_clause = ' (st_distance_sphere(POINT(`longitude`,`latitude`), POINT('+this.user.longitude+','+this.user.latitude+'))/1000) asc' 
        } else if (this.filter.orderId  === 3){
          order_clause = ' `common_tags` desc'
        } else if (this.filter.orderId  === 4){
          order_clause = ' `rating` desc'
        }
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
          this.cards.data = response.data;
          if (this.cards.data.length===0){
            this.error=true
            this.error_message = {code:0, msg:"Oops.... no mates found. Trying a new search.", error:' '}
          }
          this.error = false;
          //console.log("new data", response.data)
          this.cards.index = 0;
          this.isLoading = false;	
//
        
      } 
      catch (e) {
        if (import.meta.env.VITE_DEBUG==='true'){console.log("error: Getting Cards.",e)}
        this.error = true
        this.error_message = {code:500, msg:"Oops.... Something happen in server. Try Later", error:e}
      } 
      finally {
        this.isLoading = false;	
      }
	  },
    // handle click outside chat/profile pop up to close pending...
    handleClickOutside(event) {
      //console.log(event.target)
      try {
      let answer = document.getElementById("chat_board").contains(event.target)
      //console.log(answer)
      } catch {}
      try {
      if (!this.$refs.element_chat.contains(event.target)) {
        // Click occurred outside the element
        //console.log("oook")
        //this.toggleChat()
      }}
      catch{}
    },
  },
  mounted() {
    this.user = store.getters['user_store/getUser']
    this.getData();
    // add a listener to detect click for outside component
    //document.addEventListener('click', this.handleClickOutside);
	},
  beforeUnmount() {
    // remove listener
    //document.removeEventListener('click', this.handleClickOutside);
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
.results1 {
  width: 100vw;
	height: 100vh;
  padding: 0px;
  background-color: rgba(170, 92, 174, 0.5);
}
.results {
  flex-grow: 3;
  justify-content: center;
  background-color: rgb(4, 11, 19);
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