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
      if (process.env.DEBUG==='true'){console.log('info: Got connection!:',socket.id)};
      const list = user_socket_list.get()
      //console.log(list," ", list.len)
      socket.once('disconnect', async function() {
        if (process.env.DEBUG==='true'){console.log('info: Got a disconnect!:',socket.id)};
        //var offset = moment().utcOffset();
        const DateTime = moment.utc().utcOffset(+1).format("YYYY-MM-DD HH:mm:ss")
        // get uuid of socket disconnected and remove from connected list
        var i = 0
        var uuid = null
        const lista = user_socket_list.get()
        for (i = 0; i < lista.length; i++) {
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
          // emit new list of uuid/socket connected
          if (process.env.DEBUG==='true'){console.log('info: send new list connected.',user_socket_list.get().length)};
          socket.broadcast.emit('connected', user_socket_list.get())
          // update lastseen  in user data base
          const response = await users.updateLastSeen(uuid, DateTime)
        }
      });
    // recieve logout message del socket from user_socket_list ["", socket.id]
      socket.on('logout', async function(msg) {
        if (process.env.DEBUG==='true'){console.log('info: desconexion de ',msg)};
        // delete socket from connected list
        user_socket_list.del_socket(msg)
        // update last seen of uuid in data base
        const DateTime = moment.utc().utcOffset(+1).format("YYYY-MM-DD HH:mm:ss")
        const response = await users.updateLastSeen(msg[0], DateTime)
        // emit the list of uuid/socket connected
        socket.broadcast.emit('connected', user_socket_list.get())
      });
    // recieve login message del socket from user_socket_list
      socket.on('login', (msg) => {
        if (process.env.DEBUG==='true'){console.log('info: recieve login with token:', msg[1])};
        user_socket_list.add(msg)
        const list = user_socket_list.get()
        // send new list of uuid/socket connected to all
        if (process.env.DEBUG==='true'){console.log('isend update list connected', list)};
          this.io.emit('connected', list)
      });
    // recieve notifications message del socket
      socket.on('notifications', async function(msg) {
        if (process.env.DEBUG==='true'){console.log('info: recieve notification:', msg)};
        const socket_list = user_socket_list.get()
        const data = JSON.stringify(msg)
        const new_message = JSON.parse(data)
      // Recieve notifications have been read --> command="delete_notifications"      
        if (new_message.command==='delete_notifications'){
          if (process.env.DEBUG==='true'){console.log('info: pending notifications have been read:', new_message.to_uuid)};
          const response = await notifications.remove(msg.to_uuid)
      // send order to delete pending notifications to all seesions open of to_uuid
          var i=0
          for (i = 0; i < socket_list.length; i++) {
            if (socket_list[i][0]===msg.to_uuid){
              socket.to(socket_list[i][1]).emit('notifications',msg);
            }
          }
        }     
      // Recieve a blocked petition
          if (new_message.command==='blocked'){
            if (process.env.DEBUG==='true'){console.log('info: a block petititon.')};
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
                if (socket_list[i][0]===new_message.to_uuid || socket_list[i][0]===new_message.from_uuid){
                  if (process.env.DEBUG==='true'){console.log('info: emiting block.')};
                  socket.to(socket_list[i][1]).emit('blocked',blocked_message);
                }
              }
              // also send unlike
              const result_unlike = matched.remove(msg)
              if (result_unlike.affectedRows){
                if (process.env.DEBUG==='true'){console.log('info: delete a like.')};
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
              if (process.env.DEBUG==='true'){console.log('info: recieve a report petition.')};
              // insert in data base
              const result_save_reported2= reported.create(msg)
              // insert in logs
              const result_save_log= logs.create(msg)
              // no need to comunicate to users 
            }    
    // When is a profile view
            if (new_message.command==='viewed'){
              if (process.env.DEBUG==='true'){console.log('info: recieve a profile view.')};
              // check is from a blocked user if true do nothing
              const response_check_blocked = await blocked.getOnes(' from_uuid = "'+msg.to_uuid+'" AND to_uuid = "'+msg.from_uuid+'" ','') 
              let block = false
              if (response_check_blocked.length >0){
                    block = true
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
                  if (process.env.DEBUG==='true'){console.log('info: save notifictaion in data base.')};
                }
              }
              // always save in data base logs
              const result_save_log= logs.create(msg)
            }
      });
    // handle recieve likes/unlike/match
      socket.on('matched', async(msg) => {
        const data = JSON.stringify(msg)
        if (process.env.DEBUG==='true'){console.log('info: matched message: ' + data)};
        /*
        let new_msg={
              command: "",
              from_uuid: msg.from_uuid,
              to_uuid: msg.to_uuid,
            }
        */
        const response_check_blocked = await blocked.getOnes(' from_uuid = "'+msg.to_uuid+'" AND to_uuid = "'+msg.from_uuid+'" ','') 
        let block = false
        if (response_check_blocked.length >0){
          block = true
        } else {block = false}
        if (block===false){    // I am not block
          // is a like add to database
          if (msg.command==="liked"){
            // insert in data base matches
            const result = await matched.create(msg)// update rating of user
            // insert in data base logs
            const result_save_likes= notifications.create(msg)
            const response_add_rating = users.updateRating(msg.to_uuid,1)
          }
          // is a unlike remove from data base
          if (msg.command==="unliked"){
            // insert in data base matches
            const result = await matched.remove(msg)
            // insert in data base logs
            const result_save_unlikes= notifications.create(msg)
            const response_add_rating = await users.updateRating(msg.to_uuid,-1)
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

    // handle recieve messages of chats
      socket.on('chat', async (msg) => {
        const data = JSON.stringify(msg)
        if (process.env.DEBUG==='true'){console.log('info: chat message: ' + data)};
        // get list of socket user connected
        const socket_list = user_socket_list.get()
        // check is from a blocked user 
        const response_check_blocked = await blocked.getOnes(' from_uuid = "'+msg.to_uuid+'" AND to_uuid = "'+msg.from_uuid+'" ','') 
        let block = false
        if (response_check_blocked.length >0){ //check if is a blocked user
          block = true
        } else { block = false}
        // define msg with command:message
        msg.command= 'message'
        // if is from a blocked user do nothing
        if (block === false){
          let online = false // check if user online
          var i=0
          for (i = 0; i < socket_list.length; i++) {
            if (socket_list[i][0]===msg.to_uuid || socket_list[i][0]===msg.from_uuid){
              //console.log("sending notifications to destination user    :", socket_list[i][0], 'mmm', msg.to_uuid, 'socket', socket_list[i][1])
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
        const result_save_log= logs.create(msg)
      });

    // recieve info not used
      socket.on('info', (msg) => {
        //console.log('message1: ' + msg);
        socket.emit('info', msg);
      });
    });
  }
  return this;
})();

module.exports = SocketSingleton;