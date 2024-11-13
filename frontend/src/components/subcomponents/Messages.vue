<!-- {from_uuid:"270a80a8-79dc-11ef-aa04-0242ac140002",from_username: "Pepe", to_uuid:"a1b86a50-7c4a-11ef-aa04-0242ac140002", to_username:"pepe1", timestamp: 1223232332, message:"this is the message"},-->
<template>
  <div>
    <div class="message" v-for="(message,index) in messages" v-bind:key="index" :class="{own: message.to_uuid == user_data.uuid}">
    <!-- filtering messages also  done in back end --->
    <p :class="message.to_uuid===this.user_data.uuid ? 'chat__message': 'chat__message chat__message__reciever'">
          <span class="chat__message__name" >
            {{message.from_username}}
          </span>
            {{message.message}}
          <span class="chat__message__timestamp" >
            {{message.timestamp}}
          </span>
      </p>
    </div>
  </div>
</template>


<script>
  import Image from './Image.vue'
  import store from '../../store/index'

  export default {
    data () {
      return {
        user_data: store.getters['user_store/getUser'],
      }
    },
    props: [
      'messages'
    ],
    components: {
      'chat-image': Image
    },
    computed: {
    },
    methods: {
      imageLoad () {
        // this.$emit('imageLoad')
      }
    }
  }
</script>

<style>
  span.emoji {
    font-size: 20px;
    vertical-align: middle;
    line-height: 2;
  }
  .chat__message{
    position: relative;
    font-size: small;
    padding: 5px;
    color: rgb(0, 0, 0);
    border-radius: 10px;
    width: fit-content;
    background-color: white;
    margin-bottom: 15px;
}
.chat__message__reciever{
    margin-left: auto;
    background-color: #0cc942;
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
    font-size: xx-small;
}
</style>
