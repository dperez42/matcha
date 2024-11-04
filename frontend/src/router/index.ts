import Vue from 'vue'
import axios from 'axios'
import store from '../store/index'
import { createRouter, createWebHistory} from 'vue-router'
import authService from '../services/authService'
import {socket} from '../services/socket'

import NotFoundComponent from '../components/NonFound404.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import MyProfile from '../components/MyProfile.vue'
import Recovery from '../components/Recovery.vue'
import Reset from '../components/Reset.vue'
import Helloworld from '../components/Helloworld.vue'
import Table from '../components/Table.vue'
import Gallery from '../components/Gallery.vue'
import Browsing from '../components/Browsing.vue'

import Testground from '../components/Testground.vue'


///****** this is a middleware ******///
async function checkAuth(to, from, next){
  console.log("check req", to)
  console.log("check req", to.query.matcha_token)
  // if request have a token save it in local storage p.e. reset password
  if (to.query.matcha_token != undefined){
    console.log("here")
    authService.deleteToken()
    authService.setToken(to.query.matcha_token)
  }
  // check if there is a valid token in storage calling backend return true/false
  const is_valid_token = await authService.checkToken()
  if (is_valid_token) {
      if (import.meta.env.VITE_DEBUG==='true'){
        console.log("info: you have a valid matcha_token")
      }
      // si  ya esta cargado el user no lo cargo
      const is_authenticate = store.getters["user_store/getIsAuthenticated"]
      console.log(is_authenticate)
      if (!is_authenticate){
        console.log ("info: first loading")
        const token = localStorage.getItem('matcha_token');
        let axiosConfig = {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
            // sending the token assign a token (uuid) with a Socket
            'Socket': socket.id   
            // sending last location assign with uuid?
            //"Access-Control-Allow-Origin": "*",
          }
        };
        try {
  // get user data with the uuid inside token
          const response = await axios.get("/uuid/", axiosConfig)	
          // parsing list of tags...
          console.log(response.data[0])
          if (response.data[0].tags===null){
            response.data[0].tags ='[]'
            response.data[0].tags = JSON.parse(response.data[0].tags)
          } else {
            response.data[0].tags ='["'+response.data[0].tags.replaceAll(',','","')+'"]'
            response.data[0].tags = JSON.parse(response.data[0].tags)
          }
          console.log(response.data[0].tags)
          store.commit("user_store/setUser",response.data[0])  //load user data
          store.commit("user_store/setSocket",socket.id);      //load current socket in user data
          console.log("info: loaded user data. "+response.data[0].uuid+","+socket.id)
  // send message of correct login to server to add current uuid/socket to list of user connected
          console.log("info: send message of login to back")
          socket.emit('login',[response.data[0].uuid, socket.id])
  // get users connected
          const response_connected = await axios.get("/connected/", axiosConfig)
          store.commit("connected_store/setUUID",response_connected.data)
  // get pending notifications
          const response_notifications = await axios.get("/notifications",axiosConfig)
          store.commit("notifications_store/setNotifications", response_notifications.data)
  // get matched users
          const response_matched = await axios.get("/matched",axiosConfig)
          console.log("info: get matched ", response_matched.data)
          store.commit("matched_store/setMatched", response_matched.data)
  // get blocked users
          const response_blocked = await axios.get("/blocked",axiosConfig)
          store.commit("blocked_store/setBlocked", response_blocked.data)
  // get blocked users
          const response_logs = await axios.get("/logs",axiosConfig)
          store.commit("logs_store/setLogs", response_logs.data)
          // new updates of these information will be update by socket messages
          /// *** IMPORTANT THIS HAPPENT ONLY WITH TOKEN IN REQUEST IF NOT ALL THESE IS DONE IN LOGIN VIEW ***
  // get list of tags
          let axiosConfig1 = {
            params:{
              uuid: response.data[0].uuid
            },
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              'Authorization': `Bearer ${token}`,
              'ngrok-skip-browser-warning': 'true',
              // sending the token assign a token (uuid) with a Socket
              'Socket': socket.id   
              // sending last location assign with uuid?
              //"Access-Control-Allow-Origin": "*",
            }
          };
          const response_tags = await axios.get("/tags",axiosConfig1)
          console.log("first")
          console.log(response_tags.data)
          store.commit("tags_store/setTags", response_tags.data)
  // set Is Authenticate to true
          store.commit("user_store/setIsAuthenticated",true)
          console.log("info: user authenticated")
        } catch (err) {
          authService.deleteToken()        // delete token because no uuid
          console.log(err)
          next("/login");
        }  
      }
  } else {
    if (import.meta.env.VITE_DEBUG==='true'){
      console.log("info: you don´t have a valid matcha_token")
    }
    authService.deleteToken()  // no es un token válido se borra
    //socket.emit('logout',["", socket.id])
    // delete store
    store.commit("user_store/delUser")                  // delete user_store
    store.commit("blocked_store/delBlocked")            // delete blocked_store
    store.commit("connected_store/delConnected")        // delete connected_store
    store.commit("matched_store/delAllMatched")         // delete matched_store
    store.commit("notifications_store/delNotification") // delete notification_store
    store.commit("message_store/delMessages")           // delete message_store
    store.commit("logs_store/delLogs")           // delete message_store
    store.commit("tags_store/delTags")           // delete tags_store
    next("/login")
  }
  next()
}
/// profile completed
function checkProfile(to, from, next){
  const user = store.getters['user_store/getUser']
    console.log("go to profile", user.completed)
    if (user.completed === 0){
      console.log("go to profile")
      next("/profile");
    } else {
      next()
    }
}
/// Log out function delete all data of current user ///
function logout(to, from, next){
  // delete token
  authService.deleteToken()
  // send message of logout to server to delete socket from list os user connected
  const user= store.getters["user_store/getUser"]
  socket.emit('logout',[user.uuid, socket.id])
  // delete store
  store.commit("user_store/delUser")                 // delete user_store
  store.commit("blocked_store/delAllBlocked")          // delete blocked_store
  store.commit("connected_store/delAllUUID")        // delete connected_store
  store.commit("matched_store/delAllMatched")         // delete matched_store
  store.commit("notifications_store/delNotifications") // delete notification_store
  store.commit("message_store/delMessages")           // delete message_store
  next("/login");
}

const routes = [
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: NotFoundComponent
    },
    {
        path: '/',
        name: 'Home',
        component: Helloworld,
        beforeEnter: [checkAuth, checkProfile] //not need to be authenticate
    },
    {
      path: '/table',
      name: 'Table',
      component: Table,
      beforeEnter: [checkAuth, checkProfile], //not need to be authenticate
  },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      //beforeEnter: checkAuth, not need to be authenticate
    }, 
    {
      path: '/profile',
      name: 'Profile',
      component: MyProfile,
      beforeEnter: [checkAuth] //need to be authenticate
    },
    {
      path: '/gallery',
      name: 'Gallery',
      component: Gallery,
      beforeEnter: [checkAuth, checkProfile], //not need to be authenticate
    },
    {
      path: '/browsing',
      name: 'Browsing',
      component: Browsing,
      beforeEnter: [checkAuth, checkProfile], //not need to be authenticate
    },
    {
      path: '/logout',
      name: 'logout',
      beforeEnter: logout,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      //beforeEnter: checkAuth, not need to be authenticate
    },
    {
      path: '/recovery',
      name: 'Recovery',
      component: Recovery,
      //beforeEnter: checkAuth, not need to be authenticate
    },
    {
      path: '/reset',
      name: 'Reset',
      component: Reset,
      beforeEnter: checkAuth, //not need to be authenticate
    },
    /*
    {
      path: '/chat',
      name: 'Chat',
      component: Chat,
      beforeEnter: [checkAuth, checkProfile] // need to be authenticate
    },
    */
]
  
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
  })
  
  export default router
