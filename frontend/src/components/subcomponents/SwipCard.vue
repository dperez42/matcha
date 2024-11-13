<template>
  
  <div
    v-if="isShowing"
    ref="interactElement"
    :class="{
      isAnimating: isInteractAnimating,
      isCurrent: isCurrent
    }"
    class="card"
    :style="{ transform: transformString }"
  >
    <v-card v-if="this.blocked_check===false" class="align-top m-0 text-white overflow-y-auto"
              color="rgba(167, 26, 64, 0.9)"
              > 
            <v-row class="pa-1" align="center" justify="center">
              <v-col no-gutters col =12 md="6">
                <v-avatar class="ma-0 pa-0 " rounded="0" size="200">
                  <v-img v-on:click.prevent = "onClickPass"
                      :src="card.avatar.startsWith('https') ? card.avatar : this.$APP_SERVER_API+'/uploads/'+card.avatar"
                      height="300px"
                      with="300px"
                      class="ma-0 pa-0 align-end text-white"
                  >        
                    <v-icon class="position: absolute; bottom:0; left:0;"
                        size="x-large" :color="this.online_check ? 'success':'error'" icon="mdi-wifi"></v-icon>
                    <v-rating 
                        :length="5"
                        :size="15"
                        :model-value="parseInt(card.rating/this.$RATING)"
                        active-color="yellow-darken-3"
                          color="orange-lighten-1"
                          readonly
                    />    
                  </v-img>
                </v-avatar>
              </v-col>
              <v-col no-gutters col =12 md="6" class="">
                  <v-row class="pt-2 text-h5 font-weight-bold" align="center" justify="center">
                    {{card.username}}
                  </v-row> 
                  <v-row class="pa-0 text-subtitle-2 font-weight-light">
                    <v-col col =12 xs="4" class="pa-0 text-md-center">
                      <v-icon class="position: absolute; bottom:0; left:0;"
                          size="large" color="white" icon="mdi-map-marker"></v-icon>
                         {{parseInt(card.distance)}} kms 
                    </v-col>
                    <v-col col =12 xs="4" class="pa- 0 text-md-center">
                      <v-icon class="position: absolute; bottom:0; left:0;"
                          size="large" color="white" icon="mdi-cake-variant"></v-icon>
                      {{card.age}} years
                    </v-col>
                    <v-col col =12 xs="4" class="pa-0 text-md-center">
                      <v-icon class="position: absolute; bottom:0; left:0;"
                          size="large" color="white" icon="mdi-human-male-female"></v-icon>
                      {{card.gender}}
                    </v-col>
                  </v-row> 
                    <v-row class="pa-0 text-subtitle-2 font-weight-light">
                  
                    <v-col col =12 xs="4" class="pa-0 text-md-center">
                      <v-icon class="position: absolute; bottom:0; left:0;"
                          size="large" color="white" icon="mdi-gender-male-female"></v-icon>
                      {{card.sexual}}
                    </v-col>
                  </v-row>
                  <v-row class="pa-0 text-subtitle-2 text-md-center font-weight-light" align="center" justify="center">
                    <v-col col =12 xs="12" class="pa-0 text-md-right">
                    <v-icon class="position: absolute; bottom:0; left:0;"
                          size="x-large" :color="this.online_check ? 'success':'error'" icon="mdi-wifi"></v-icon>
                    
                     {{this.online_check?'ON LINE':'Last seen...'+this.card.lastseen.substring(0,19)}}
                    </v-col>
                  </v-row>
                </v-col>
            </v-row>
<!--- bottons actions --->
              <v-spacer></v-spacer>
              <v-row class="pa-4 pt-1" align="center" justify="center">
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
    <div v-if="icon.opacity>0" class="myicon mx">
      <v-btn 
                    :icon="icon.type" 
                    :color="icon.color"
                    :class="'opacity-'+icon.opacity "
                    size="x-large"
      ></v-btn>
    </div>
    </div>
    
</template>

<script>
import {socket} from '../../services/socket'
import axios from "axios"
import store from '../../store/index'
import interact from "interactjs";
import { toast } from 'vue3-toastify';
const ACCEPT_CARD = "cardAccepted";
const REJECT_CARD = "cardRejected";
const SKIP_CARD = "cardSkipped";
const BLOCKED_CARD = "cardBlocked";

export default {
  static: {
    interactMaxRotation: 15,
    interactOutOfSightXCoordinate: 500,
    interactOutOfSightYCoordinate: 600,
    interactYThreshold: 150,
    interactXThreshold: 150
  },
  emits :{
    click_on_chat: null, 
    click_on_profile: null,
    click_on_like: null, 
    click_on_unlike: null,
    click_on_blocked: null,
    click_on_reported: null,
    cardSkipped: null,
    hideCard: null,
  },
  props: {
    card: {
      type: Object,
      required: true
    },
    isCurrent: {
      type: Boolean,
      required: true
    },
    
  },

  data() {
    return {
      error: false,
      error_message: '',
      isLoading: false,
      online_check: false,
      to_like_check: false,
      from_like_check: false,
      blocked_check: false,
      isShowing: true,
      isInteractAnimating: true,
      isInteractDragged: null,
      isConnect: false, // card is connected?
      isLike: false, //you emit a like
      isLiked: false, // you recieved a like
      isMatched: false, // you recieved a like
      interactPosition: {
        x: 0,
        y: 0,
        rotation: 0
      },
      icon: { opacity: 0, type: '', color:'' }
    };
  },  
  methods: {
    onClickPass() {
      this.hideCard();
    },
    onClickChat() {
      this.$emit('click_on_chat', this.card)
    },
    onClickProfile() {
      if (import.meta.env.VITE_DEBUG==='true'){console.log("info: click card profile. ")}
      this.$emit('click_on_profile', this.card)
    },
    onClickBlocked(){
      if (import.meta.env.VITE_DEBUG==='true'){console.log("info: click card blocked. ")}
      this.$emit('click_on_blocked', this.card)
      this.hideCard();
    },
    onClickReported(){
      if (import.meta.env.VITE_DEBUG==='true'){console.log("info: click card report. ")}
      this.$emit('click_on_reported', this.card)
      this.hideCard();
    },
    onClickLike(){
      if (import.meta.env.VITE_DEBUG==='true'){console.log("info: click card like. ")}
      if (!this.check_avatar()){
        toast("Update your profile photo to like "+ this.card.username, {
            autoClose: 2000,
            type: "info",
            position: "bottom-right",
          }); 
        return false
      }
      this.$emit('click_on_like', this.card)
      this.hideCard();
    },
    onClickUnLike(){
      if (import.meta.env.VITE_DEBUG==='true'){console.log("info: click card unlike. ")}
      this.$emit('click_on_unlike', this.card)
      this.hideCard();
    },
    check_avatar(){
      const user= store.getters['user_store/getUser']
      if (user.avatar === 'default.png'){
        return false
      }
      return true
    },    
    hideCard() {
      setTimeout(() => {
        this.isShowing = false;
        this.$emit("hideCard", this.card);
      }, 300);
    },
    playCard(interaction) {
      const {
        interactOutOfSightXCoordinate,
        interactOutOfSightYCoordinate,
        interactMaxRotation
      } = this.$options.static;

      this.interactUnsetElement();

      switch (interaction) {
        case ACCEPT_CARD:
          this.interactSetPosition({
            x: interactOutOfSightXCoordinate,
            rotation: interactMaxRotation
          });
          // if has a like yet do nothing
          if(this.to_like_check===false){
            this.$emit('click_on_like', this.card)
          }
          break;
        case REJECT_CARD:
          this.interactSetPosition({
            x: -interactOutOfSightXCoordinate,
            rotation: -interactMaxRotation
          });
          // if has a unlike yet do nothing
          if(this.to_like_check===true){
            this.$emit('click_on_unlike', this.card)
          }
          break;
        case SKIP_CARD:
          this.interactSetPosition({
            y: interactOutOfSightYCoordinate
          });
          this.$emit(SKIP_CARD);
          break;
        case BLOCKED_CARD:
          this.interactSetPosition({
            y: -interactOutOfSightYCoordinate
          });
          this.$emit('click_on_blocked', this.card)
          break;
      }
      this.hideCard();
    },
    // action when tap or double tapping
    playAccion(interaction) {
      //console.log(interaction)
      switch (interaction) {
        case 'BLOCK_CARD':
          this.$emit('click_on_blocked',this.card);
          break;
        case 'REPORT_CARD':
          this.$emit('click_on_reported',this.card);
          break;
        case 'CHAT_CARD':
          this.$emit('click_on_chat',this.card);
          break;
        case 'VIEW_CARD':
          this.$emit('click_on_profile',this.card);
          break;
      }
    },
    interactSetPosition(coordinates) {
      const { x = 0, y = 0, rotation = 0 } = coordinates;
      this.interactPosition = { x, y, rotation };
    },
    interactUnsetElement() {
      interact(this.$refs.interactElement).unset();
      this.isInteractDragged = true;
    },
    resetCardPosition() {
      this.interactSetPosition({ x: 0, y: 0, rotation: 0 });
      this.icon.opacity=0
    },
  },
  computed:{
    transformString() {
      if (!this.isInteractAnimating || this.isInteractDragged) {
        const { x, y, rotation } = this.interactPosition;
        return `translate3D(${x}px, ${y}px, 0) rotate(${rotation}deg)`;
      }
      return null;
    },
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
    // watch if any changes in función is_connected() in computed section
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
    // watch if any changes in función is_matched() in computed section
		nb_matched_change(newer,older){
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
      if (import.meta.env.VITE_DEBUG==='true'){console.log("info: list of blocked have change. ")}
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
    var self = this
    //self.matched()      //Check if card is like/liked
    //self.connected()    // Check if card is connected
    // make a listener to doubletap
    interact(this.$el).on('doubletap', function (event) {
      //console.log(event.type, event.target.id)
      self.playAccion(event.target.id)
      event.preventDefault()
    })
    // make a listener to tap
    interact(this.$el).on('tap', function (event) {
      //console.log(event.type, event.target.id)
      self.playAccion(event.target.id)
      event.preventDefault()
    })
    // make a listener to move card(drag) start-move-end
    interact(this.$el).draggable({
      inertia: false,
      onstart: () => {
        //console.log("here")
        this.isInteractAnimating = false // Disable CSS transitions during dragging
      },
      onmove: event => {
        //console.log("moving",event)
        const {
          interactMaxRotation,
          interactXThreshold
        } = this.$options.static;
        const x = this.interactPosition.x + event.dx;
        const y = this.interactPosition.y + event.dy;

        let rotation = interactMaxRotation * (x / interactXThreshold);

        if (rotation > interactMaxRotation) rotation = interactMaxRotation;
        else if (rotation < -interactMaxRotation)
          rotation = -interactMaxRotation;

        this.interactSetPosition({ x, y, rotation });
        //console.log("x:",x," y:", y, " tor:", rotation)
        /*
          Change icon image type based on drag direction and adjust opacity
          from 0-100 based on current rotation amount. Also emit an event to
          show/hide respective button below cards during dragging.
        */
        this.icon.type = 'match';
        if (x < 0 && Math.abs(y)<1.5*Math.abs(x)) {
          this.icon.type = 'mdi-thumb-down';
          this.icon.color ='red'
        }
        if (x > 0 && Math.abs(y)<1.5*Math.abs(x)) {
          this.icon.type = 'mdi-thumb-up';
          this.icon.color ='green'
        }
        if (y < 0 && Math.abs(y)>1.5*Math.abs(x)) {
          this.icon.type = 'mdi-cancel';
          this.icon.color ='red'
        }
        //console.log(this.icon.type)
        const opacityAmount = parseInt(Math.sqrt((x*x)+(y*y))/20)*10;
        this.icon.opacity = opacityAmount;

      },
      onend: () => {
        const { x, y } = this.interactPosition;
        const { interactXThreshold, interactYThreshold } = this.$options.static;
        this.isInteractAnimating = true;
        if (x > interactXThreshold) this.playCard(ACCEPT_CARD);
        else if (x < -interactXThreshold) this.playCard(REJECT_CARD);
        else if (y > interactYThreshold) this.playCard(SKIP_CARD);
        else if (y < -interactYThreshold) this.playCard(BLOCKED_CARD);
        else this.resetCardPosition();
      }
    });
  },//{passive:false},
  beforeDestroy() {
    // destroy listeners
    interact(this.$refs.interactElement).unset();
  },

};
</script>

<style lang="scss" scoped>
@import "./styles/index.scss";
.myicon{
  display: grid;
  place-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 8888;
  background-color: rgba(20, 30, 213, 0.5);   
}
$cardsTotal: 3;
$cardsWidth: 100px;
$cardsPositionOffset: 55vh * 0.06;
$cardsScaleOffset: 0.05;
$defaultTranslation: $cardsPositionOffset * $cardsTotal;
$defaultScale: 1 - ($cardsScaleOffset * $cardsTotal);

.card {
  @include card();
  @include absolute(0);
  @include sizing(90%);
  @include flex-center();

  @include after() {
    @include sizing(21px 3px);
    @include absolute(right 0 bottom 11px left 0);
    margin: auto;
    border-radius: 50px;
    background: rgba(#000, 0.3);
  }
  display: flex;
  flex-direction: column;
  margin: auto;
  background-image: linear-gradient(
    -90deg,
    #d25c56 2%,
    #df1165 100%
  );
  opacity: 0;
  transform: translateY($defaultTranslation) scale($defaultScale);
  transform-origin: 50%, 100%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  user-select: none;
  pointer-events: none;
  will-change: transform, opacity;

  &.isCurrent {
    pointer-events: auto;
  }

  &.isAnimating {
    transition: transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275);;
  }
}

@for $i from 1 through $cardsTotal {
  $index: $i - 1;
  $translation: $cardsPositionOffset * $index;
  $scale: 1 - ($cardsScaleOffset * $index);

  .card:nth-child(#{$i}) {
    z-index: $cardsTotal - $index;
    opacity: 1;
    transform: translateY($translation) scale($scale);
    @if $i == 3 {
      color: #432958;
      background-color: #432958;
    } @else if $i == 2 {
      color: #73345e;
      background-color: #73345e;
    }

    @if $i != 1 {
      background-image: none;
      @include after() {
        @include sizing(0 0);
      }
    }
  }
}
</style>