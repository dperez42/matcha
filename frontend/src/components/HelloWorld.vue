<template>
<v-card class="mx-auto my-0 pa-0"
    color="black"
    elevation="16"
    width="100vw"
    height="100vh">
  <v-card
    class="mx-auto mt-10"
    max-width="600"
  >
    <v-img
      class="align-end text-white"
      height="200"
      src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
      cover
    >
      <v-card-title>Wellcome, {{this.user.username}}</v-card-title>
    </v-img>

    <v-card-subtitle class="pt-4">
      Users Connected: {{nb_connected}}, Notifications: {{nb_notifications}}
    </v-card-subtitle>
    <v-divider></v-divider>
    <v-card-text class="justify-start px-6 py-3">
      <div>Matcha, the best dating app to find your couple.</div>
      <v-divider></v-divider>
      <div><v-icon color="#e84c73">mdi-map-search-outline</v-icon> Use MAP to find connected users near to you.</div>
      <div><v-icon color="#e84c73">mdi-heart-search</v-icon> Use BROWSING to get a list of suggestion based in proximity, sexual preferences ...</div>
      <div><v-icon color="#e84c73">mdi-account-search-outline</v-icon> Use RESEARCH to make and advance custom search.</div>
    </v-card-text>

    <v-card-actions class="justify-center px-6 py-3">
        <v-btn to="/map" color="#e84c73">
                <v-icon>mdi-map-search-outline</v-icon>
                <span>MAP</span>
        </v-btn>
        <v-btn to="/browsing" color="#e84c73">
                <v-icon>mdi-heart-search</v-icon>
                <span>BROWSING</span>
        </v-btn>
        <v-btn to="/gallery" color="#e84c73">
                <v-icon>mdi-account-search-outline</v-icon>
                <span>RESEARCH</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</v-card>
</template>

<script>
import store from '../store/index'
import axios from "axios"

export default {
  name: 'HelloWorld',
  components: {
  },
  data: () => ({
    error: false,
		error_message: "",
    user: store.getters['user_store/getUser'],
    list_connected: store.getters['connected_store/getUUIDs'],
    nb_notifications: store.state.notifications_store.nb_notifications,
    list_logs: store.getters['logs_store/getLogs'],
    nb_connected: store.state.connected_store.nb_connected,
  }),
  async mounted() {
	},
  methods:{
  },
  computed:{
    nb_connected_change(){
      return (store.state.connected_store.nb_connected )
    },
    nb_notifications_change(){
      return (store.state.notifications_store.nb_notifications)
    },
  }, 
  watch: {
		nb_connected_change(newer,older){
      this.nb_connected = store.state.connected_store.nb_connected
    },
    nb_notifications_change(newer,older){
      this.nb_notifications = store.state.notifications_store.nb_notifications
      this.list_notifications= store.getters['notifications_store/getNotifications']
    },
  mounted() {
    this.user = store.getters["user_store/getUser"]
    this.isAuthenticated= store.getters['user_store/getIsAuthenticated'],
    this.nb_connected = store.state.connected_store.nb_connected
    this.nb_notifications = store.state.notifications_store.nb_notifications
  }
  },
}
</script>
