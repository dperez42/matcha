// https://socket.io/how-to/use-with-vue#sample-projects
import { reactive } from "vue";
import { io } from "socket.io-client";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import router from '../router'
import store from '../store/index'
import authService from '../services/authService'
export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: []
});

// "undefined" means the URL will be computed from the `window.location` object
//const serverURL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";
const serverURL = import.meta.env.VITE_APP_SERVER_API===undefined ? 'http://localhost:3000':import.meta.env.VITE_APP_SERVER_API;
// ws://localhost:3000
export const socket = io(serverURL,{extraHeaders: {
    "ngrok-skip-browser-warning": true,
  }})

socket.on("connect", () => {
  state.connected = true;
  if (import.meta.env.VITE_DEBUG==='true'){console.log("info: socket connected", socket.id)}
  // load socket in store
  store.commit("user_store/setSocket",socket.id);
});

socket.on("disconnect", () => {
  if (import.meta.env.VITE_DEBUG==='true'){console.log("socket disconneted")}
  state.connected = false;
});
// recieve a verification from click in link email
socket.on("verification", (msg) => {
  if (import.meta.env.VITE_DEBUG==='true'){console.log("info:  message in topic 'verification':"+ msg.msg + msg.token)}
  // Check if the message is for me
  //const socket = store.getters['user_store/getSocket']
  //if (socket === msg.socket){
  //  console.log("info: New token for email confirmation")
      // update token
  if (msg.msg === 'success!'){
      authService.deleteToken()
      authService.setToken(msg.token)
      // Push to home, to authenticate, load user, etc..
      router.push("/");
  }
  if (msg.msg === 'fail!'){
    alert('Oops. Username or email already exits!')
  }
});
// recieve a notification and load in notifications_store
socket.on("notifications", (msg) => {
  console.log("recieve notification with msg" , msg)
  const user = store.getters['user_store/getUser']
  
  // the notification recieved is for me? also controlled in backend
  if (msg.to_uuid ===  user.uuid){
    //toast('recieve notification with msg'+msg)
    if (msg.command==='notification'){
        store.commit("notifications_store/addNotification",msg)
    }
    if (msg.command==='delete_notifications'){
      // if you read notifications in other session delete notifications in store
      console.log("recieve a delete notifications")
      store.commit("notifications_store/delNotifications")
    }
    
    //console.log(store.getters['notifications_store/getNotifications'])
    //console.log(msg)
  }
});
// response to a request from backend asking if client is authenticate when refresh or restarat backend
socket.on("info", (msg) => {
  //toast(msg)
  //console.log(msg)
  // send message of login to server to add current socket to list of user connected
  //if (store.getters["user_store/getIsAuthenticated"]){
  //  socket.emit('login',[store.getters["user_store/getUser"].uuid,store.getters["user_store/getSocket"]])
  //}
});

// recieve new list uuid connected
socket.on("connected", (msg) => {
  if (import.meta.env.VITE_DEBUG==='true'){console.log("info socket: new list user-socket arrived.")}
  store.commit("connected_store/setUUID",msg)
});
// recieve new message
socket.on("chat", (msg) => {
  const user = store.getters['user_store/getUser']
  // the message recieved is for me? also controlled in backend
  if (msg.to_uuid ===  user.uuid || msg.from_uuid ===  user.uuid){
    //toast("New message from "+msg.from_username)
    store.commit("message_store/addMessage",msg)
    store.commit("notifications_store/addNotification",msg)
    if (import.meta.env.VITE_TOAST==='true'){
      toast("You have a new message from "+msg.to_username, {
        autoClose: 2000,
        type: "info",
        position: "bottom-right",
      });
    } 
  }
  
});
// recieve new user blocked from other session
socket.on("blocked", (msg) => {
  if (import.meta.env.VITE_DEBUG==='true'){console.log("info socket: recieved blocked", msg)}
  const user = store.getters['user_store/getUser']
  // the message recieved is for me? also controlled in backend
  
  if (msg.from_uuid ===  user.uuid){
    if (import.meta.env.VITE_TOAST==='true'){
      toast("New Blocked message from "+msg.from_username, {
        autoClose: 2000,
        type: "info",
        position: "bottom-right",
      });
    } 
    store.commit("blocked_store/addBlocked",msg)
    //router.go(); // Reloads the current route
  }
  
});
// recieve new user profile view 
socket.on("viewed", (msg) => {
  if (import.meta.env.VITE_DEBUG==='true'){console.log("info socket: recieved a view. ",msg)}
  const user = store.getters['user_store/getUser']  
  if (msg.to_uuid ===  user.uuid){
    if (import.meta.env.VITE_TOAST==='true'){
      toast(msg.from_username + " has view your profile", {
        autoClose: 2000,
        type: "info",
        position: "bottom-right",
      });
    } 
    store.commit("logs_store/addLogs",msg)
    store.commit("notifications_store/addNotification",msg)
    //router.go(); // Reloads the current route
  }
  
});

// recieve likes/unlikes
socket.on("matched", async (msg) => {
  const user = store.getters['user_store/getUser']
  if (import.meta.env.VITE_DEBUG==='true'){console.log("info socket: recieve liked. ", msg)}
  // the message recieved is for me? also controlled in backend
  if (msg.from_uuid ===  user.uuid || msg.to_uuid ===  user.uuid){
    if (msg.command === 'liked'){
      if (import.meta.env.VITE_TOAST==='true'){
        toast(msg.from_username + " give you a like", {
          autoClose: 2000,
          type: "info",
          position: "bottom-right",
        });
      } 
      const like = {
        from_uuid: msg.from_uuid,
        to_uuid: msg.to_uuid,
      }
      // add new liked to store
      store.commit("matched_store/addLike",like)
      store.commit("notifications_store/addNotification",msg)
      // add new log to our history
      store.commit("logs_store/addLogs",msg)
    // check is there a match-------------------------------------------
      const like_list= await store.getters['matched_store/getMatched']
      var i
      var to = false
      var from = false
      for (i=0; i< like_list.length;i++) {
            //console.log("-X-",user.uuid,msg.from_uuid)
            //console.log("--",like_list[i].to_uuid,like_list[i].from_uuid)
          if (like_list[i].to_uuid === user.uuid && like_list[i].from_uuid === msg.from_uuid){
            //console.log("A")
            to = true
          }
          if (like_list[i].from_uuid === user.uuid && like_list[i].to_uuid === msg.from_uuid){
            //console.log("B")
            from = true
          }
      }
      if (to && from){
        if (import.meta.env.VITE_TOAST==='true'){
          if (import.meta.env.VITE_DEBUG==='true'){console.log("info socket: recieve a MATCH",  msg)}
          const match_msg = {
            command:"match",
            to_uuid:msg.to_uuid,
            from_uuid:msg.from_uuid,
            to_username:msg.to_username,
            from_username:msg.from_username,
            message:"this is a match",
            timestamp:msg.timestamp,
          }
          store.commit("notifications_store/addNotification",match_msg)
          toast(msg.from_username + " matched", {
            autoClose: 2000,
            type: "info",
            position: "bottom-right",
          });
        } 
      }
    }
    if (msg.command === 'unliked'){
      if (import.meta.env.VITE_DEBUG==='true'){console.log("info socket: recieve unliked. ", msg)}
      if (import.meta.env.VITE_TOAST==='true'){
        toast(msg.from_username + " give you an unlike", {
          autoClose: 2000,
          type: "info",
          position: "bottom-right",
        });
      }
      // delete liked from store
      store.commit("matched_store/delLike",msg)
      store.commit("notifications_store/addNotification",msg)
      // add new log to our history
      store.commit("logs_store/addLogs",msg) 
    }
  }
});

socket.on("foo", (...args) => {
  state.fooEvents.push(args);
});

socket.on("bar", (...args) => {
  state.barEvents.push(args);
});