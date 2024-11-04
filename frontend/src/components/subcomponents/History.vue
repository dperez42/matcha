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
    <!-- TABLE BOARD-->      
          <v-row>
            <v-col sm="12">
             <div class="chat-container" ref="chatContainer" >
                   <v-table>
                      <thead>
                        <tr>
                          <th class="text-left">
                            Date
                          </th>
                          <th class="text-left">
                            Action
                          </th>
                          <th class="text-left">
                            Username
                          </th>
                          <th class="text-left">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(item,index) in this.logs"
                          :key="index"
                        >
                          <td>{{ item.timestamp }}</td>
                          <td>{{ item.command }}</td>
                          <td>{{ item.from_username }}</td>
                          <td>{{ item.message }}</td>
                        </tr>
                      </tbody>
                   </v-table>
              </div>
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

export default {
  name: 'Chat',
  components: {
  },
  props: {
  },
  data() {
    return{
          error: false,
          error_message: '',
          isLoading: false,
          user: null,
          logs: null,
    }
  },
  computed:{
    nb_logs(){
        //console.log("jjjj")
        return (store.state.logs_store.nb_logs)
    },
  },
  watch: {
    nb_logs(newer,older){
        //this.messages= store.state.message_store.messages
        //console.log(`We haddddve from ${older} to ${newer} fruits now, yay!`)
        this.scrollToEnd()
    },
	},
  methods: {
    // scroll down when send message
      scrollToEnd () {
        this.$nextTick(() => {
          var container = this.$el.querySelector('.chat-container')
          container.scrollTop = container.scrollHeight
        })
      },
  },
  mounted() {
    this.user = store.getters['user_store/getUser']
    this.logs = store.getters['logs_store/getLogs']
    this.scrollToEnd()
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
    height: calc(100vh - 11rem);
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