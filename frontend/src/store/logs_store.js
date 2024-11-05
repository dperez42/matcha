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
notifications: [ 
      {
        command:  'liked',
        from_uuid:'uuiiiid1',
        from_username:'from jjj',
        to_username: 'to kjkjj',
        to_uuid: 'uuuuid2',
        message: 'this is alike',
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
    logs: [ 
      /*
      {
        command:  'liked',
        from_uuid:'uuiiiid1',
        from_username:'from jjj',
        to_username: 'to kjkjj',
        to_uuid: 'uuuuid2',
        message: 'this is alike',
        timestamp: 1718036112572
      }*/
    ],
    nb_logs: 0
  },
  mutations: {
    // Mutations are responsible for changing the state
    setLogs(state, newList) {
      // setting pending notifications list in store
      state.logs=newList;
      state.nb_logs = state.logs.length
    },
    addLogs(state, newLog) {
      state.nb_logs = state.nb_logs + 1
      state.logs.push(newLog);
      console.log(state.logs)
    },
    delLogs(state) {
      state.logs = [];
      state.nb_logs = 0;
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
    getLogs: (state) => state.logs,
    getCountLogs(state){
      return state.logs.length
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