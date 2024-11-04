//https://dev.to/chintanonweb/comprehensive-guide-to-vuejs-3-state-management-with-vuex-1bo1
//for mutations this.$store.commit("user_store/setUser",this.user_temp);
//this.$store.state.user_store.user
//this.$store.getters["user_store/getUser"]
//for actions this.$store.dispatch('yourModuleName/doSomething') ASYNC????
//console.log("socket connected", socket.id)
//store.commit("user_store/setSocket",socket.id);
//console.log(store.getters['user_store/getSocket'])
import authService from '../services/authService'
import axios from "axios"

export default {
  namespaced: true,
  state: {
    // Your application state goes here
    user:  null,
    /*
      {
          username: 'dperez',
          first: 'firstname',
          last: 'lastname',
          email: 'email@gmail.com',
          gender: 'Male',
          sexual: 'Bisexual',
          address: 'address',
          city: 'city_',
          zip: 'zip_',
          country: 'US',
          bio: 'kdhfkjshdfjshdkshdkfsdjkfkdhjdhfkjsdhfhdssh',
          tags: ['sports', 'fish'],
          rating: 3,
          avatar: 'https://therichpost.com/wp-content/uploads/2021/03/avatar1.png',
          img1: 'https://therichpost.com/wp-content/uploads/2021/03/avatar2.png',
          img2: 'https://therichpost.com/wp-content/uploads/2021/03/avatar3.png',
          img3: 'https://therichpost.com/wp-content/uploads/2021/03/avatar4.png',
          img4: 'https://therichpost.com/wp-content/uploads/2021/03/avatar5.png',
      },
    */
    socket: null,
    isAuthenticated: false
  },
  mutations: {
    // Mutations are responsible for changing the state

    setUser(state, user) {
      state.user = user;
    },
    setIsAuthenticated(state,isAuthenticated){
      state.isAuthenticated = isAuthenticated;
    },
    setSocket(state, socket) {
      state.socket = socket;
    },
    delUser(state){
      state.user=  null,
      state.socket= null,
      state.isAuthenticated= false  
    }
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
    getUser: (state) => state.user,
    getIsAuthenticated: (state) => state.isAuthenticated,
    getSocket: (state) => state.socket,
  },
/*
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