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

export default {
  namespaced: true,
  state: {
    tags: [ 
      /*
      {
        uuid:'uuiiiid1',
        tag: 'sport'
      }
      */
    ],
    nb_tags: 0
  },
  mutations: {
    // Mutations are responsible for changing the state
    setTags(state, tagList) {
      state.tags =[]
      var i
      for (i = 0; i < tagList.length; i++) {
        state.tags.push(tagList[i].tag)
      }
      state.nb_tags = state.tags.length
    },
    loadTags(state, tagList) {
      var i
      state.tags =[]
      for (i = 0; i < tagList.length; i++) {
        state.tags.push(tagList[i])
      }
      state.nb_tags = state.tags.length
    },
    delTags(state) {
      state.tags =[];
      state.nb_tags = 0
    },
  },
  actions: {

  },
  getters: {
    // Getters are used to retrieve state data with computed properties
    getTags: (state) => state.tags,
    getCountTags(state){
      return state.tags.length
    } 
  },
}