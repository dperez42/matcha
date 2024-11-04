//https://dev.to/chintanonweb/comprehensive-guide-to-vuejs-3-state-management-with-vuex-1bo1
//import store from '../store/index'
//this.user = store.getters['user_store/getUser']
//console.log("notificatios",store.getters['notifications_store/getNotifications'])
//console.log("notificatios",store.getters['notifications_store/getCountNotifications'])
// for mutations
// store.commit("notifications_store/delNotifications");
//for actions this.$store.dispatch('yourModuleName/doSomething') ASYNC????
//console.log("socket connected", socket.id)
//store.commit("user_store/setSocket",socket.id);
//console.log(store.getters['user_store/getSocket'])

/* 
    messages: [ 
      {
        from_uuid:'uuiiiid1',
        from_username:'from jjj',
        to_username: 'to kjkjj',
        to_uuid: 'uuuuid2',
        message: 'this is message',
        timestamp: 1718036112572
      },
      {...}
    ]
*/
import authService from '../services/authService'
import axios from "axios"

export default {
  namespaced: true,
  state: {
    messages: [ 
      {
        from_uuid:'uuiiiid1',
        from_username:'from jjj',
        to_username: 'to kjkjj',
        to_uuid: 'uuuuid2',
        message: 'this is message',
        timestamp: 1718036112572
      }
    ],
    nb_messages: 0
  },
  mutations: {
    // Mutations are responsible for changing the state
    //set new list of messages in store
    setMessages(state, newList) {
      state.messages=newList;
      //console.log("Update list of messages")
      //console.log(state.messages)
      state.nb_messages = state.messages.length
      console.log(state.nb_messages)
    },
    //add new message to store messages
    addMessage(state, newMessage) {
      //console.log(state.messages)
      //console.log("new message", newMessage)
      state.messages.push(newMessage);
      //console.log(state.messages)
      state.nb_messages = state.nb_messages+1
      console.log(state.nb_messages)
    },
    //del all messages in store messages
    delMessages(state) {
      state.messages = [];
    },
  },
  actions: {
    async refreshUser({ commit }){
      var get_data = {
        //'password': this.input.password,
      };
      const token = localStorage.getItem('token');
      let axiosConfig = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': `Bearer ${token}`,
            //"Access-Control-Allow-Origin": "*",
        }
      };
      try {
        const response = await axios.get("/uuid/", // get user data with uuid
          axiosConfig)	
         // parsing list of tags...
        response.data[0].tags ='["'+response.data[0].tags.replaceAll(',','","')+'"]'
        response.data[0].tags = JSON.parse(response.data[0].tags) 
        commit("setUser",response.data[0])     // Load user data
        console.log("response:", response)
      } catch (err) {
        authService.deleteToken()                               // delete token beacause no uuid
        console.log(err)
      } 
    }
    // Actions are used to commit mutations asynchronously
    /*
    incrementAsync({ commit }) {
      setTimeout(() => {
        commit('increment');
      }, 1000);
    },
    */
  },
  getters: {
    // Getters are used to retrieve state data with computed properties
    getMessages(state){ 
      console.log("in stor")
      return state.messages},
    getCountMessages(state){
      return state.messages.length
    } 
  },
/* 
const mutations: MutationTree<State> = {
    setUser(state, user: User) {
      state.user = user;
      state.isAuthenticated = !!user;  
    },
}
const actions: ActionTree<State, State> = {
    async fetchUser({ commit }, token: string) {
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.id;
  
      const userResponse = await axios.get(`/api/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      commit('setUser', userResponse.data)
    },

async getUser() {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/user`, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });
      return response;    
    },
  

  }
  */
}