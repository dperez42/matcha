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
          <v-card color="#952175">
                <div class="d-flex flex-no-wrap justify-space-between">                 
                  <v-avatar
                    class="ma-3"
                    rounded="0"
                    size="65"
                  > 
                  <v-img :src="card.avatar.startsWith('https') ? card.avatar : this.$APP_SERVER_API+'/uploads/'+card.avatar"/>
                  </v-avatar>
                  <div>
                    <v-card-title class="text-h4 text-white text-right">
                      {{this.card.username}}
                    </v-card-title >
                    <v-card-subtitle class="text-white text-right">
                      {{this.online_check?'ON LINE':'OFF LINE: Last seen..'}}{{this.online_check?'':this.card.lastseen.substring(0,19)}}
                    </v-card-subtitle>
                  </div>

                </div>
          </v-card>
          </v-col>
        </v-row>
  <!-- CHAT BOARD-->      
        <v-row>
          <v-col sm="12">
            <div class="chat-container" ref="chatContainer" >
              <message :messages="messages" ></message>
            </div>
          </v-col>
        </v-row>
  <!-- CHAT ACTIONS -->
        <v-row align="center" justify="center">
          <v-col col="1" sm="2" >
                <v-btn size="small" elevation="8"
                  color="purple"
                  icon="mdi-emoticon"
                   @click.prevent="toggleEmojiPanel"
                ></v-btn>
               <emoji-picker ref="elementpicker"
                :show="emojiPanel" @click_on_emoji="addEmojiToMessage" @click_close_emoji="toggleEmojiPanel"></emoji-picker>
          </v-col>
          <v-col col="10" sm="8" class="text-h3 text-white" >
                <form>
                <v-text-field 
                  v-model="input" 
                  @keydown.enter.prevent="send_message"
                  type="text" 
                  placeholder="Type a message..."
                  bg-color="white"
                  clearable>
                </v-text-field>
                </form>
            </v-col>
            <v-col col="1" sm="2" >
                <v-btn size="small" elevation="8"
                  color="purple"
                  icon="mdi-send"
                   @click.prevent="send_message"
                ></v-btn>
            </v-col>
        </v-row>  
      </v-col>
    </v-row>
</v-container>
</template>

<script lang="ts">
import store from '../../store/index'
import {socket} from '../../services/socket'
import moment from 'moment'
import axios from "axios"
import Message from './Messages.vue'
import EmojiPicker from './EmojiPicker.vue'
import Error500 from '../InternalErrorServer500.vue'
export default {
  name: 'Chat',
  components: {
      Message,
      EmojiPicker,
      Error500,
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
        input:'',
        messages:null,
        emojiPanel: false,
	}
  },
  computed:{
      nb_messages(){
        //console.log("jjjj")
        return (store.state.message_store.nb_messages)
      },
      nb_connected_change(){
      return (store.state.connected_store.nb_connected )
      }
  },
  watch: {
      nb_messages(newer,older){
        this.messages= store.state.message_store.messages
        //console.log(`We haddddve from ${older} to ${newer} fruits now, yay!`)
        this.scrollToEnd()
        },
      nb_connected_change(newer,older){
        const data = store.state.connected_store.connected_uuids
        const data_filter = data.filter((item) => item[0] === this.card.uuid)
        if (data_filter.length > 0){
          this.online_check= true
        }
        else {
        this.online_check= false
        }
        //https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
        //this.connected_uuids =  data_filter.filter((value, index, array) => array.indexOf(value) === index);
        //this.connected_uuids = [...new Set(data_filter.map(item => item[0]))];
        //this.connected_uuids = [...new Set(data_filter.map(item => item[0]))];
    },
	},
  methods: {
    // inicial load of messages between user <> other 
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
    // send message to back end
      send_message(){
        if (this.input !== '') {
          //var offset = moment().utcOffset();
          const DateTime = moment.utc().utcOffset(+2).format("YYYY/MM/DD HH:mm:ss")
          //console.log(DateTime)
          const message = {
                from_uuid:this.user.uuid,
                from_username:this.user.username,
                to_uuid: this.card.uuid,
                to_username: this.card.username,
                message: this.input,
                timestamp: DateTime //pass to databae in seconds
          }
          //console.log("send message:", message)
          //load in message store
          store.commit("message_store/addMessage",message);
          //emit message, load in data base or do it in back?
          socket.emit('chat',
            {
                from_uuid:this.user.uuid,
                from_username:this.user.username,
                to_uuid: this.card.uuid,
                to_username: this.card.username,
                message: this.input,
                timestamp: DateTime //pass to databae in seconds
            }
          )
          this.input=''
          this.emojiPanel = false
        }
      },
    // scroll down when send message
      scrollToEnd () {
        this.$nextTick(() => {
          var container = this.$el.querySelector('.chat-container')
          container.scrollTop = container.scrollHeight
        })
      },
    // Handle Emoji Panel
      addEmojiToMessage (emoji) {
        this.input += emoji.value
      },
      toggleEmojiPanel () {
        this.emojiPanel = !this.emojiPanel
      }
  },
  async mounted() {
    // init check online
    this.isLoading = true
    const data = store.state.connected_store.connected_uuids
    const data_filter = data.filter((item) => item[0] === this.card.uuid)
          if (data_filter.length > 0){
            this.online_check= true
          }
          else {
          this.online_check= false
          }
    // get messages from user <> other
    this.getMessages()
  },
}
</script>
<style scoped>
.scrollable {
    overflow-y: auto;
    height: 90vh;
  }
  .typer{
    box-sizing: border-box;
    display: flex;
    align-items: center;
    bottom: 0;
    height: 4.9rem;
    width: 100%;
    background-color: rgb(68, 36, 36);
    box-shadow: 0 -5px 10px -5px rgba(0,0,0,.2);
  }
  .typer input[type=text]{
    position: absolute;
    left: 2.5rem;
    padding: 1rem;
    width: 80%;
    background-color: transparent;
    border: none;
    outline: none;
    font-size: 1.25rem;
  }
  .chat-container{
    box-sizing: border-box;
    height: calc(100vh - 21rem);
    overflow-y: auto;
    padding: 20px 10px 10px 10px ;
    background-image: url("../../assets/background_board.png");
    background-size: cover;
  }
  .chat-container .username{
    font-size: 18px;
    font-weight: bold;
  }
  .chat-container .content{
    padding: 8px;
    background-color: lightgreen;
    border-radius: 10px;
    display:inline-block;
    box-shadow: 0 1px 3px 0 rgba(0,0,0,0.2), 0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12);
    max-width: 50%;
    word-wrap: break-word;
    }
  @media (max-width: 480px) {
    .chat-container .content{
      max-width: 60%;
    }
  }

</style>