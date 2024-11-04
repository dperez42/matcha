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
connected_uuids: [[uuid,socket],[]]
*/
import authService from '../services/authService'
import axios from "axios"

export default {
  namespaced: true,
  state: {
    connected_uuids: [],
    nb_connected: 0
  },
  mutations: {
    // Mutations are responsible for changing the state
    setUUID(state, newList) {
      state.connected_uuids = JSON.parse(JSON.stringify(newList))
      state.nb_connected = state.connected_uuids.length
      //state.push(newList[0])
      console.log("new connected list", state.connected_uuids ,state.nb_connected)
    },
    addUUID(state, newUUID) {
      //state.push(newUUID);
    },
    delAllUUID(state) {
      state.connected_uuids = [];
      state.nb_connected = 0
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
    getUUIDs(state){
      return state.connected_uuids
    },
    nb_UUIDs(state){
      console.log("ggggegeg"+state.connected_uuids.length)
      return state.connected_uuids.length
    },
    isConnected(state,uuid){
      console.log("isconnecte")
      let i=0
      while (i < state.connected_uuids.length){
        if (state.connected_uuids[i]===uuid){
          return true
        }
        i = i ++
      }
      return false
    },

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