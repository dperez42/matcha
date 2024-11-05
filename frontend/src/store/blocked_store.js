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
    blocked: [ 
      /*
      {
        from_uuid:'uuiiiid1',
        to_uuid: 'uuuuid2',
        timestamp: 1718036112572
      }
      */
    ],
    nb_blocked: 0
  },
  mutations: {
    // Mutations are responsible for changing the state
    setBlocked(state, newList) {
      // setting pending notifications list in store
      state.blocked=newList;
      state.nb_blocked = state.blocked.length
    },
    addBlocked(state, newBlocked) {
      state.blocked.push(newBlocked);
      state.nb_blocked = state.nb_blocked +1
    },
    delAllBlocked(state) {
      state.blocked = [];
      state.nb_blocked = 0
    },
  },
  actions: {

  },
  getters: {
    // Getters are used to retrieve state data with computed properties
    getBlocked: (state) => state.blocked,
    getCountBlocked(state){
      return state.blocked.length
    } 
  },
}