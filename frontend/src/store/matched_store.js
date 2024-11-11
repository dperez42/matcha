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
import authService from '../services/authService'
import axios from "axios"

export default {
  namespaced: true,
  state: {
    matched_uuids:[],

    /*
    */
    nb_matched: 0
  },
  mutations: {
    // Mutations are responsible for changing the state
    setMatched(state, newList) {
      state.matched_uuids = newList
      state.nb_matched = state.matched_uuids.length
    },
    addLike(state, like) {
      state.matched_uuids.push(like);
      state.nb_matched = state.nb_matched +1
    },
    delLike(state, like) {
      let spliced =[]
      for (let i = 0; i < state.matched_uuids.length; i++) {
        if (state.matched_uuids[i].from_uuid != like.from_uuid && state.matched_uuids[i].to_uuid != like.to_uuid) {
          if (import.meta.env.VITE_DEBUG==='true'){console.log("info: dell like.")}
          spliced.push(state.matched_uuids[i]);
        }
      }
      state.matched_uuids = spliced
      state.nb_matched = state.nb_matched - 1
    },
    delAllMatched(state) {
      state.matched_uuids = [];
      state.nb_matched = 0;
    },
  },
  actions: {
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
    getMatched(state){
      return state.matched_uuids
    },

    getCountMatched(state){
      return state.matched_uuids.length
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