const db = require('../services/db.js');

////// GET ////////
// get notifications not read
async function getOnes(where_clause, order_by_clause){
  let tmp = ''
  if (where_clause!='' & where_clause!= undefined){
    tmp = 'WHERE ' + where_clause
  }
  if (order_by_clause!='' & order_by_clause != undefined){
    tmp = tmp + 'ORDER BY '+order_by_clause
  }
  //console.log(`SELECT * FROM notificationsTmp ${tmp}`)
  const data = await db.query(
    `SELECT * FROM notificationsTmp ${tmp}`
  );
  //console.log(data)
  // const data = helper.emptyOrRows(rows);
  return data
}

////// CREATE ////////
async function create(data){
  try {
    const my_query2 = `INSERT INTO notificationsTmp(command, from_username, from_uuid, to_username, to_uuid, message, timestamp) VALUES ("${data.command}", "${data.from_username}", "${data.from_uuid}", "${data.to_username}", "${data.to_uuid}", "${data.message}", "${data.timestamp}")`
    //console.log(my_query2)
    const result2 = await db.query(my_query2);
    let message = 'Error in creating notifications';
    if (result.affectedRows) {
      message = 'Notification created successfully';
    } 
    //console.log(message)
    return {message};
  } catch (err){
    //console.log(err.sqlMessage)
  }
}
/////// REMOVE ///////
async function remove(uuid){
  const result = await db.query(
    `DELETE FROM notificationsTmp WHERE to_uuid="${uuid}"`
  );
  let message = 'Error in deleting notifications';
  if (result.affectedRows) {
    message = 'notifications not read of user deleted successfully';
  }
  return {message};
}

module.exports = {
  getOnes,
  create,
  remove
}