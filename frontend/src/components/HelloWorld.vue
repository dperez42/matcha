<template>
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
      <v-card-title>Top 10 Australian beaches</v-card-title>
    </v-img>

    <v-card-subtitle class="pt-4">
      Users Connected: {{list_connected.length}}, Notifications: {{nb_notifications}}
    </v-card-subtitle>

    <v-card-text>
      {{nb_connected}}

      <div>Whitehaven Beach</div>
      <div>Whitsunday Island, Whitsunday Islands</div>
    </v-card-text>

    <v-card-actions>
      <v-btn color="orange" text="Map"></v-btn>

      <v-btn color="orange" text="Browsing"></v-btn>
      <v-btn color="orange" text="Research"></v-btn>
    </v-card-actions>
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
    nb_connected: store.getters['connected_store/getCountUUIDs'],
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
