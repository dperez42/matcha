<template>
  <v-app id="app">
<!-- defino la app-bar -->
    <v-app-bar v-if="this.$store.state.user_store.isAuthenticated===true"
      color="teal-darken-4"
      image="https://picsum.photos/1920/1080?random"
      class="d-flex align-center"
    >
    <v-app-bar-nav-icon to="/">
            <v-avatar size="36px">
            <v-img
                alt="Logo"
                src="./matcha.png"
              ></v-img>
            </v-avatar>
        </v-app-bar-nav-icon>
    <v-app-bar-title class="text-h5 font-weight-light  text-left pa-0 ">MATCHA</v-app-bar-title>
    <!-- crea un gradiente en la imagen -->
    <template v-slot:image>
        <v-img gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"></v-img>
    </template>
    
    <!--{{this.user!=null ? this.user.username:''}}-->
    
          <v-badge 
            :content="this.nb_connected"
            color="black">
            <v-icon icon="mdi-account-group" size="30"></v-icon>
          </v-badge>
          <v-btn icon @click.prevent="toggleNotificationReaded">
          <notification-bell v-if="this.$store.state.user_store.user"
                :size="20"
                :count="this.nb_notifications"
                :upperLimit="50"
                counterLocation="upperRight"
                counterStyle="round"
                counterBackgroundColor="#FF0000"
                counterTextColor="#FFFFFF"
                iconColor="#000000"      
          />
          <v-menu activator="parent">
          <ListNotification :show="notificationPanel" :data="list_notifications" ></ListNotification>
          </v-menu>
      </v-btn>
      <!--
      <v-btn to="/map">
        <v-icon>mdi-image-multiple</v-icon>
        <span>MAP</span>
      </v-btn>
      <v-btn to="/gallery">
        <v-icon>mdi-image-multiple</v-icon>
        <span>GALLERY</span>
      </v-btn>
      <v-btn to="/browsing">
        <v-icon>mdi-image-multiple</v-icon>
        <span>BROWSING</span>
      </v-btn>
      -->

<!-- Menu desplegable para administración usuario -->
    <template v-slot:append>
        <v-btn icon>
          <v-icon v-if="this.user===null">mdi-dots-vertical</v-icon>
          
          <v-avatar v-if="this.user!=null"
            color="grey-darken-3"
            :image="user.avatar.startsWith('https') ? user.avatar : $APP_SERVER_API+'/uploads/'+this.$store.state.user_store.user.avatar"    
          ></v-avatar>
        
          <v-menu activator="parent">
            <v-list>
              <v-list-item >
              <v-btn to="/map">
              <v-icon>mdi-map-search-outline</v-icon>
              <span>MAP</span>
            </v-btn>
            </v-list-item>
            <v-list-item >
            <v-btn to="/browsing">
              <v-icon>mdi-heart-search</v-icon>
              <span>BROWSING</span>
            </v-btn>
            </v-list-item>
            <v-list-item >
            <v-btn to="/gallery">
              <v-icon>mdi-account-search-outline</v-icon>
              <span>GALLERY</span>
            </v-btn>
            </v-list-item>
            


              <v-list-item >
                <v-btn to="/profile" >
                  <v-icon>mdi-account-outline</v-icon>
                  <span>Profile</span>
                </v-btn>
              </v-list-item>
              <v-list-item >
                <v-btn value="nearby" to="/logout">
                  <v-icon>mdi-logout</v-icon>
                  <span>Logout</span>
                </v-btn>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
    </template>
    </v-app-bar>
<!-- defino la seccion de contenidos class="d-flex align-center justify-center ma-11 pt-2" color="green"-->
    <v-main>
      <v-container fluid class="ma-0 pa-0">
        <router-view/>
      </v-container>
    </v-main>
<!-- defino el footer-->
    <v-footer app inset color="#e84c73" class="">
      <v-row justify="center" align="center" no-gutters>
        <v-col class="text-subtitle-2 text-center text-sm-right mt-0" cols="12" sm="6">
          {{ new Date().getFullYear() }} — <strong>Matcha.</strong>
        </v-col>
         <v-col class="text-subtitle-2 text-center text-sm-left mt-0" cols="12" sm="6">
          Develop by dperez-z and juan-gon
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import store from './store/index'
import NotificationBell from './components/subcomponents/NotificationBell.vue'
import ListNotification from './components/subcomponents/NotificationList.vue'
import {socket} from './services/socket'
import moment from 'moment'


export default {
  name: 'App',

  components: {
    NotificationBell,
    ListNotification,
  },

  data: () => ({
    //
    user: store.state.user_store.user, //store.getters['user_store/getUser'],
    isAuthenticated: store.getters['user_store/getIsAuthenticated'],
    nb_connected: store.getters['connected_store/CountUUIDs'],
    nb_notifications: store.getters['notifications_store/getCountNotifications'],
    list_notifications: store.getters['notifications_store/getNotifications'],
    notificationPanel: true,
    notificationReaded: false,
    server_URL: ''
  }),
  methods:{
    toggleNotificationReaded () {
      this.notificationReaded = !this.notificationReaded
    }
  },
  computed:{
    nb_connected_change(){
      return (store.state.connected_store.nb_connected )
    },
    nb_notifications_change(){
      return (store.state.notifications_store.nb_notifications)
    },
    user_change(){
      return (store.state.user_store.isAuthenticated)
    }
  },
  watch: {
		nb_connected_change(newer,older){
      this.nb_connected = store.state.connected_store.nb_connected
    },
    nb_notifications_change(newer,older){
      this.nb_notifications = store.state.notifications_store.nb_notifications
      this.list_notifications= store.getters['notifications_store/getNotifications']
    },
    notificationReaded(newer,older){
      this.user= store.getters['user_store/getUser']
      if (older===true && newer ===false){
        // delete store
        store.commit("notifications_store/delNotifications");
        // send message to delete in database
        const DateTime = moment.utc().utcOffset(+2).format("YYYY/MM/DD HH:mm:ss")
        socket.emit('notifications',
          {
              command:  'delete_notifications',
              from_uuid: this.user.uuid,
              from_username:this.user.username,
              to_uuid: this.user.uuid,
              to_username: this.user.username,
              message: "notifications have been read",
              timestamp: DateTime
          },
        )
      }
    },
    user_change(newer,older){
      this.user = store.getters["user_store/getUser"]
    }
	},
  onmounted(){
  },
  mounted() {
    this.user = store.getters["user_store/getUser"]
    this.isAuthenticated= store.getters['user_store/getIsAuthenticated'],
    this.nb_connected = store.state.connected_store.nb_connected
    this.nb_notifications = store.state.notifications_store.nb_notifications
    this.list_notifications= store.getters['notifications_store/getNotifications']
    if (import.meta.env.VITE_DEBUG==='true'){console.log("info: starting App.")
    }
  }
}
</script>
<style>
#app {
  max-width: 100%;
  text-align: center;
  padding: 0 !important;
  margin: 0 auto !important;
}
</style>