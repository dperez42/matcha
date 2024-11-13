<template>  
  <div>
    <p class="text-black">{{this.message}}</p>
    <p class="text-black">{{this.card}}</p>
    <!-- filtering messages also  done in back end --->
    <p v-if="(this.card.uuid === this.message.from_uuid && this.message.to_uuid===this.user.uuid) || (this.card.uuid === this.message.to_uuid && this.message.from_uuid===this.user.uuid) "
        :class="this.message.to_username===this.user.username ? 'chat__message': 'chat__message chat__message__reciever'"
        >
          <span class="chat__message__name" >
            {{this.message.from_username}}
          </span>
            {{this.message.message}}
          <span class="chat__message__timestamp" >
            {{this.message.timestamp}}
          </span>
      </p>
  </div>
    
</template>

<script>
import {socket} from '../../services/socket'
import axios from "axios"
import store from '../../store/index'

export default {
  props: {
    message: {
      type: Object,
      required: true
    },  
    user: {
      type: Object,
      required: false
    },  
    card: {
      type: Object,
      required: true
    }, 
  },

  data() {
    return {
    };
  },

  computed: {
  },

  mounted() {
  },//{passive:false},

  beforeDestroy() {
  },
  methods: {
  },
	watch: {
	}
  
};
</script>

<style  scoped>
.chat__message{
    position: relative;
    font-size: small;
    padding: 5px;
    border-radius: 10px;
    width: fit-content;
    background-color: rgb(189, 49, 49);
    color: rgb(0, 0, 0);
    margin-bottom: 15px;
}
.chat__message__reciever{
    margin-left: auto;
    background-color: #406326;
}
.chat__message__name{
    position: absolute;
    top: -15px;
    color: rgb(0, 0, 0);
    font-weight: 800;
    font-size: x-small;
}
.chat__message__timestamp{
    margin-left: 10x;
    color: rgb(0, 0, 0);
    font-size: xx-small;
}
</style>