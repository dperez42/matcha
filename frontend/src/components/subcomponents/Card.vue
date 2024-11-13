<template>
            <v-card v-if="this.blocked_check===false" class="align-top mr-0 text-white"
              color="rgba(167, 26, 64, 0.9)"
              > 
              <v-row class="pa-1" align="center" justify="center">
                <v-col col =12 md="4">
                  <v-avatar class="ma-0 pa-0 " rounded="0" size="200">
                    <v-img :src="card.avatar.startsWith('https') ? card.avatar : this.$APP_SERVER_API+'/uploads/'+card.avatar"
                        height="300px"
                        with="300px"
                        class="ma-0 pa-0 align-end text-white"
                    >        
                    <v-rating class="pa-2"
                          :length="5"
                          :size="25"
                          :model-value="parseInt(card.rating/this.$RATING)"
                          active-color="yellow-darken-3"
                            color="orange-lighten-1"
                            readonly
                      />    
                    </v-img>
                  </v-avatar>
                </v-col>
                <v-col col =12 md="8">
                  <v-row class="pa-3 text-h5 font-weight-bold" align="center" justify="center">
                    {{card.username}}
                  </v-row> 
                  <v-row class="pa-1 text-subtitle-2 font-weight-light">
                    <v-col col =12 xs="4" class="text-md-center">
                      <v-icon class="position: absolute; bottom:0; left:0;"
                          size="large" color="white" icon="mdi-map-marker"></v-icon>
                         {{parseInt(card.distance)}} kms 
                    </v-col>
                    <v-col col =12 xs="4" class="text-md-center">
                      <v-icon class="position: absolute; bottom:0; left:0;"
                          size="large" color="white" icon="mdi-cake-variant"></v-icon>
                      {{card.age}} years
                    </v-col>
                    <v-col col =12 xs="4" class="text-md-center">
                      <v-icon class="position: absolute; bottom:0; left:0;"
                          size="large" color="white" icon="mdi-human-male-female"></v-icon>
                      {{card.gender}}
                    </v-col>
                  </v-row> 
                   <v-col col =12 xs="4" class="text-md-center">
                      <v-icon class="position: absolute; bottom:0; left:0;"
                          size="large" color="white" icon="mdi-gender-male-female"></v-icon>
                      {{card.sexual}}
                    </v-col>

                  <v-row class="pa-1 text-subtitle-2 font-weight-light" align="center" justify="center">
                      <v-col col =12 xs="12" class="text-md-right">
                         <v-icon class="position: absolute; bottom:0; left:0;"
                          size="x-large" :color="this.online_check ? 'success':'error'" icon="mdi-wifi"></v-icon>
                    
                      {{this.online_check?'ON LINE':'Last seen...'+this.card.lastseen.substring(0,19)}}
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
  <!--- bottons actions --->
                <v-spacer></v-spacer>
                <v-row class="pa-4" align="center" justify="center">
                  <v-tooltip text="Report Fake Account" location="top">
                  <template v-slot:activator="{ props } "> 
                  <v-btn v-bind="props"
                    v-on:click.prevent = "onClickReported" 
                    class="ma-1"
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
                    class="ma-1"
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
                  <v-tooltip text="Profile" location="top">
                  <template v-slot:activator="{ props } "> 
                    <v-btn v-bind="props"
                      class="ma-1 text-white"
                      elevation="8"
                      color="#4ABDE1"
                      icon="mdi-face-man-profile"
                      size="small"
                      v-on:click.prevent = "onClickProfile" 
                    ></v-btn>
                  </template>
                  </v-tooltip>
                  <v-tooltip text="Chat" location="top">
                  <template v-slot:activator="{ props } "> 
                    <v-btn v-bind="props"
                      class="ma-1"
                      elevation="8"
                      :color="this.from_like_check && this.to_like_check ? 'success':'grey'"
                      icon="mdi-chat"
                      :disabled="!(this.from_like_check && this.to_like_check)"
                      size="small"
                      v-on:click.prevent = "onClickChat"    
                    ></v-btn>
                  </template>
                  </v-tooltip>
                </v-row>
          </v-card>
</template>

<script>
import store from '../../store/index'
import { toast } from 'vue3-toastify'; 

export default {
  emits :{
    click_on_chat: null, 
    click_on_profile: null,
    click_on_like: null, 
    click_on_unlike: null,
    click_on_blocked: null,
    click_on_reported: null
  },
  components: {
  },
  props: {
    card: {
      type: Object,
      required: true
    },
  },
  data() {
    return{
      error: false,
      error_message: '',
      isLoading: false,
      online_check: false,
      to_like_check: false,
      from_like_check: false,
      blocked_check: false
    }
  },
  methods: {
    onClickChat () {
       if (import.meta.env.VITE_DEBUG==='true'){console.log("info: click chat")}
      console.log("click chat", this.check_avatar())
      
      this.$emit('click_on_chat', this.card)
    },
    onClickProfile () {
      //console.log("click profile")
      this.$emit('click_on_profile', this.card)
    },
    onClickLike () {
      //console.log("click like")
      if (!this.check_avatar()){
        if (import.meta.env.VITE_DEBUG==='true'){console.log("error: no picture in avatar.")}
        toast("Update your profile photo to like "+ this.card.username, {
            autoClose: 2000,
            type: "info",
            position: "bottom-right",
          }); 
        return false
      }
      this.$emit('click_on_like', this.card)
    },
    onClickUnLike () {
      //console.log("click unlike")
      this.$emit('click_on_unlike', this.card)
    },
    onClickBlocked () {
      //console.log("click blocked")
      this.$emit('click_on_blocked', this.card)
    },
    onClickReported () {
      //console.log("click reported")
      this.$emit('click_on_reported', this.card)
    },
    check_avatar(){
      const user= store.getters['user_store/getUser']
      if (user.avatar === 'default.png'){
        return false
      }
      return true
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
      if (import.meta.env.VITE_DEBUG==='true'){console.log("info: macthed have change.")}
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
    //console.log(data_matched)
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
    },
    nb_blocked_change(newer,older){
      if (import.meta.env.VITE_DEBUG==='true'){console.log("info: blocked have change")}
      const user= store.getters['user_store/getUser']
      const data = store.state.blocked_store.blocked
      const data_filter = data.filter((item) => item.to_uuid === this.card.uuid)
      if (data_filter.length > 0){
        this.blocked_check= true
      }
      else {
        this.blocked_check= false
      }
    },
	},
  mounted() {
    // init check online
    //this.isLoading = true
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
    //console.log("aqui")
    ///console.log(data_matched)
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
  },
};
</script>

<style lang="scss" scoped>
.cards {
  position: relative;
  display: flex;
  justify-content: center;
  margin: 10px;      /* margin to borders */
  width: 50%;         /*350px anchor  of card*/
}
</style>
