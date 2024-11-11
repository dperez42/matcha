var socket = require('socket.io');
const socket_list = require('./socket_list')
const user_socket_list = require('./user_socket_list')
const notifications = require('../controllers/notifications')
const logs = require('../controllers/logs')
const messages = require('../controllers/messages')
const users = require('../controllers/users')
const blocked = require('../controllers/blocked')
const matched = require('../controllers/matched')
const reported = require('../controllers/reported')
const moment = require('moment')

var SocketSingleton = (function() {
  this.io = null;
  this.configure = function(server) {
    this.io = socket(server, {
            cors: {
              origin: '*' ,
              methods: ["GET", "POST"],
              transports: ['polling'],
              credentials: true
            }
          });
    this.io.on('connection', (socket) => {
          console.log('Got connection!:',socket.id);
          const list = user_socket_list.get()
          console.log(list," ", list.len)
          //var offset = moment().utcOffset();
          //const DateTime = moment.utc().utcOffset(+2).format("YYYY/MM/DD HH:mm:ss")
          //console.log(DateTime)
          //socket_list.STATIC_CONNECTIONS.push(socket.id);
          // ask is this connection is an authorize user, send info request to socket
          // this is for renew connection when backend restart and frontend was open
          //socket.emit('info',"this a request of info")
          //.to(socket.id)
          //console.log("lista de sockets:", socket_list.STATIC_CONNECTIONS)
          //console.log("lista de user-sockets:", user_socket_list.get())
          //socket.broadcast.emit('connected', user_socket_list.get())

          socket.once('disconnect', async function() {
            console.log('Got a disconnect!:', socket.id);
            //var offset = moment().utcOffset();
            const DateTime = moment.utc().utcOffset(+2).format("YYYY-MM-DD HH:mm:ss")
            // get uuid of socket disconnected
            var i
            var uuid = null
            const lista = user_socket_list.get()
            //console.log(user_socket_list.length)
            for (i = 0; i < lista.length; i++) {
              //console.log(user_socket_list[i][0], "mmmm",user_socket_list[i][1], " .... ", socket.id)
              if (lista[i][1]===socket.id){
                uuid = lista[i][0]
              }
            }
            // delete from list of active connections and list of active users_connections
            //var i = socket_list.STATIC_CONNECTIONS.indexOf(socket.id);
            //socket_list.STATIC_CONNECTIONS.splice(i, 1);
            // delete socket in user socket list
            if (uuid != null){
              user_socket_list.del_socket(["",socket.id])
              // emit the list of uuid/socket connected
              console.log("send update list connected", user_socket_list.get().length)
              //console.log("lista de sockets:", socket_list.STATIC_CONNECTIONS);
              socket.broadcast.emit('connected', user_socket_list.get())
              // update lastseen  in user data
              const response = await users.updateLastSeen(uuid, DateTime)
              console.log(response)
            }
          });
          // recieve logout message del socket from user_socket_list ["", socket.id]
          socket.on('logout', async function(msg) {
            console.log("desconexion de ",msg)
            // delete socket from connected list
            user_socket_list.del_socket(msg)
            // update last seen of uuid in data base
            const DateTime = moment.utc().utcOffset(+2).format("YYYY-MM-DD HH:mm:ss")
            const response = await users.updateLastSeen(msg[0], DateTime)
            // emit the list of uuid/socket connected
            socket.broadcast.emit('connected', user_socket_list.get())
          });
          // recieve login message del socket from user_socket_list
          socket.on('login', (msg) => {
            console.log("recieve login with token:", msg[1])
            user_socket_list.add(msg)
            const list = user_socket_list.get()
            // emit emit the list of uuid/socket connected
            console.log("send update list connected", list)
            //for ( const item of list){
            //  console.log(item[1])
            //socket.broadcast.emit('connected', list)
            //socket.to(msg[1]).emit('connected', list)
            // Send to all users
            this.io.emit('connected', list)
            //}
            // y a uno mismo
          });
    // recieve notifications message del socket
          socket.on('notifications', async function(msg) {
            const socket_list = user_socket_list.get()
            console.log("recieve notification:", msg)
            const data = JSON.stringify(msg)
            const new_message = JSON.parse(data)
            console.log(new_message)
    // When pending notifications have been read        
            if (new_message.command==='delete_notifications'){
              console.log("recieved a deletion notifications",new_message.to_uuid)
              const response = await notifications.remove(msg.to_uuid)
              console.log(response)
              // send order to delete pending notifications to all seesions open of to_uuid
              var i
              for (i = 0; i < socket_list.length; i++) {
                console.log(socket_list[i]);
                if (socket_list[i][0]===msg.to_uuid){
                  console.log("sending deletion notifications to destination user    :", socket_list[i][1], msg)
                  // sent the message if is connected other sessions
                  socket.to(socket_list[i][1]).emit('notifications',msg);
                  //socket.emit('chat',msg);
                }
              }
            }
            
    // When is a blocked petition
            if (new_message.command==='blocked'){
              console.log("this is a block petition")
              // insert in data base blocked
              const response = await blocked.create(msg)
              // insert in data base logs
              const result_save_blocked= notifications.create(msg)
              // update blocked store in front by socket 
              // send message of reload matched list to affected users
              const blocked_message =     {
                from_uuid: new_message.from_uuid,
                to_uuid: new_message.to_uuid,
                timestamp: new_message.timestamp
              }
              const socket_list = user_socket_list.get()
              for (i = 0; i < socket_list.length; i++) {
                console.log("p:", socket_list[i][0])
                if (socket_list[i][0]===new_message.to_uuid || socket_list[i][0]===new_message.from_uuid){
                  console.log("emiting block")
                  socket.to(socket_list[i][1]).emit('blocked',blocked_message);
                }
              }
              // also send unlike
              const result_unlike = matched.remove(msg)
              if (result_unlike.affectedRows){
                  console.log("si")
              }
              msg.command = 'unliked'
              for (i = 0; i < socket_list.length; i++) {
                if (socket_list[i][0]===msg.to_uuid || socket_list[i][0]===msg.from_uuid){
                  socket.to(socket_list[i][1]).emit('matched',msg);
                }
              }
            }
    // When is a reported petition
            if (new_message.command==='report'){
              console.log("this is reported pet¡tion")
              // insert in data base
              const result_save_reported2= reported.create(msg)
              // insert in logs
              const result_save_log= logs.create(msg)
              // no need to comunicate to users 
            }    
    // When is a profile view
            if (new_message.command==='viewed'){
              console.log("this is profile viewed")
              // check is from a blocked user if true do nothing
                  const response_check_blocked = await blocked.getOnes(' from_uuid = "'+msg.to_uuid+'" AND to_uuid = "'+msg.from_uuid+'" ','') 
                  let block = false
                  if (response_check_blocked.length >0){
                    block = true
                    console.log("is blockes")
                  } else { block = false}

                  if (block === false){
                    // insert in data base notififications temp
                    const result_save_viewed= notifications.create(msg)
                    // update store in front by socket
                    let online = false // check if blocked user online
                    const socket_list = user_socket_list.get()
                    for (i = 0; i < socket_list.length; i++) {
                      if (socket_list[i][0]===msg.to_uuid){
                        online = true
                        socket.to(socket_list[i][1]).emit('viewed',msg);
                        
                      }
                    }
                    // save in data base notifications temp if outline, before always save until read no matter if online
                    if (online===false){
                      console.log("save")
                      //const result_save_viewed= notifications.create(msg)
                    }
                  }
              // always save in data base logs
              const result_save_log= logs.create(msg)
            }
          });
    // handle recieve likes/unlike
          socket.on('matched', async(msg) => {
            console.log(msg)
            const data = JSON.stringify(msg)
            console.log('matchedf message: ' + data);
            let new_msg={
              command: "",
              from_uuid: msg.from_uuid,
              to_uuid: msg.to_uuid,
            }
            const response_check_blocked = await blocked.getOnes(' from_uuid = "'+msg.to_uuid+'" AND to_uuid = "'+msg.from_uuid+'" ','') 
            let block = false
            console.log(response_check_blocked.length)
            if (response_check_blocked.length >0){
              block = true
            } else {block = false}
            if (block===false){
              //console.log("I not block")
                  // is a like add to database
                  if (msg.command==="liked"){
                    // insert in data base matches
                    const result = await matched.create(msg)// update rating of user
                    // insert in data base logs
                    const result_save_likes= notifications.create(msg)
                    const response_add_rating = users.updateRating(msg.to_uuid,1)
                    //new_msg.command = 'liked'
                  }
                  // is a unlike remove from data base
                  if (msg.command==="unliked"){
                    // insert in data base matches
                    const result = await matched.remove(msg)
                    // insert in data base logs
                    const result_save_unlikes= notifications.create(msg)
                    const response_add_rating = await users.updateRating(msg.to_uuid,-1)
                    //new_msg.command = 'unliked'
                  }

                  // update store in front by socket
                  let online_from = false 
                  let online_to = false 
                  const socket_list = user_socket_list.get()
                  for (i = 0; i < socket_list.length; i++) {
                    if (socket_list[i][0]===msg.to_uuid){
                      online_to = true //to_user is on line
                      socket.to(socket_list[i][1]).emit('matched',msg);
                    }
                    if (socket_list[i][0]===msg.from_uuid){
                      online_from = true  // from_user is on line
                      socket.to(socket_list[i][1]).emit('matched',msg);
                    }
                  }
                  // save in data base notifications temp if to_user outline, always save no matter if online 
                  if (online_to===false){
                    //const result_save_viewed= notifications.create(msg)
                  }
                }
            // always save in data base logs
            const result_save_log= logs.create(msg)
          });

    //prepared to recieve messages of chats
          socket.on('chat', async (msg) => {
            const data = JSON.stringify(msg)
            console.log('chat message: ' + data);

            // get list of socket user connected
            const socket_list = user_socket_list.get()

            // check is from a blocked user 
            const response_check_blocked = await blocked.getOnes(' from_uuid = "'+msg.to_uuid+'" AND to_uuid = "'+msg.from_uuid+'" ','') 
            let block = false
            if (response_check_blocked.length >0){
              block = true
              console.log("is a blocked")
            } else { block = false}

            // define msg with command:message
            msg.command= 'message'

            // if is from a blocked user do nothing
            if (block === false){
              let online = false // check if user online
              var i
              for (i = 0; i < socket_list.length; i++) {
                console.log(socket_list[i]);
                if (socket_list[i][0]===msg.to_uuid || socket_list[i][0]===msg.from_uuid){
                  console.log("sending notifications to destination user    :", socket_list[i][0], 'mmm', msg.to_uuid, 'socket', socket_list[i][1])
                  // sent the message if is connected: other user or other session
                  socket.to(socket_list[i][1]).emit('chat',msg);
                  online = true
                }
              }
              // Save message in message database
              const result_save_message = messages.create(JSON.parse(data))
              // Save message in pending notifications
              const result_save_notification= notifications.create(msg)
            }
            // always save in data base logs
            console.log("save in logs")
            const result_save_log= logs.create(msg)
          });

    // recieve info
          socket.on('info', (msg) => {
            console.log('message1: ' + msg);
            socket.emit('info', msg);
          });
        });
  }
  return this;
})();

module.exports = SocketSingleton;