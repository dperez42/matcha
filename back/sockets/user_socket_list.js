// variable que guarda las conexiones con usuarios abiertas
//p.e. [[uuid,socket], ...]
//[
//[ '331aa313-75e8-11ef-aa04-0242ac140002', 'tRdcDQPzXTFAoPrhAAAB' ],
//[ '270a80a8-79dc-11ef-aa04-0242ac140002', 'wWhebfRj0BZhsPcAAAAD' ],
//[ '270a80a8-79dc-11ef-aa04-0242ac140002', '-ihzwkWaXc7DtB2nAAAF' ]
// ]
var user_socket_list = []

exports.get = function() {
    return user_socket_list;
};


exports.set= function(newlist) {
    user_socket_list = newlist;
};

exports.add= function(new_elem) {
   if (new_elem[1]!=undefined){
    user_socket_list.push(new_elem);
    if (process.env.DEBUG==='true'){console.log("info: new user-socket add: ", new_elem)};
   }
   return true
};
// borrar el elmen ùuid, socket] de la lista de user_socket-list (usuarios logeados conectados)
exports.del_socket= function(elem) {
    //delete a socket from user_list_socket
    if (process.env.DEBUG==='true'){console.log("info: new user-socket add: ", elem[1])};
    var temp_list = []
    var i
    i = 0
    while (i< user_socket_list.length){
      if (user_socket_list[i][1]!=elem[1]){
        temp_list.push(user_socket_list[i])
      }
      i++;
    }
    user_socket_list = temp_list
    if (process.env.DEBUG==='true'){console.log("info: new user-socket-list: ", user_socket_list)};
};

