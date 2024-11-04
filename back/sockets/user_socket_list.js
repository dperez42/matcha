// variable que guarda las conexiones con usuarios abiertas
//p.e. [[uuid,socket], ...]
//[
//[ '331aa313-75e8-11ef-aa04-0242ac140002', 'tRdcDQPzXTFAoPrhAAAB' ],
//[ '270a80a8-79dc-11ef-aa04-0242ac140002', 'wWhebfRj0BZhsPcAAAAD' ],
//[ '270a80a8-79dc-11ef-aa04-0242ac140002', '-ihzwkWaXc7DtB2nAAAF' ]
// ]
var user_socket_list = []

exports.get = function() {
    //get user_list_socket
    return user_socket_list;
};


exports.set= function(newlist) {
    //validate the name...
    user_socket_list = newlist;
};

exports.add= function(new_elem) {
    //add a uuid-socket to user_list_socket
    ///*** check if exits ****/
    /*
    let cont = 0
    let exits = false
    while (cont < user_socket_list.length){
      if (user_socket_list[cont][0]===new_elem[0]){
        exits = true
      }
      cont = cont + 1
    }
    if (!exits) {
      user_socket_list.push(new_elem);
    }
    */
   if (new_elem[1]!=undefined){
    user_socket_list.push(new_elem);
    console.log("new user-socket add: ", new_elem)
    //console.log("new user-socket-list:", user_socket_list)
   }
   return true
};
// borrar el elmen ùuid, socket] de la lista de user_socket-list (usuarios logeados conectados)
exports.del_socket= function(elem) {
    //delete a socket from user_list_socket
    console.log("new user-socket del: ", elem[1])
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
    console.log("new user-socket-list:", user_socket_list)
};

