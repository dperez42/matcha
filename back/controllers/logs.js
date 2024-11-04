const db = require('../services/db.js');

////// GET ////////
// get get blocked users 
async function getLogs(where_clause, order_by_clause){
  let tmp = ''
  if (where_clause!='' & where_clause!= undefined){
    tmp = 'WHERE ' + where_clause
  }
  if (order_by_clause!='' & order_by_clause != undefined){
    tmp = tmp + 'ORDER BY '+order_by_clause
  }
  console.log(`SELECT * FROM notifications`)// ${tmp}`)
  const data = await db.query(
    `SELECT * FROM notifications ${tmp}`
  );
  console.log(data)
  // const data = helper.emptyOrRows(rows);
  return data
}

////// CREATE ////////
async function create(data){
  try {
    const my_query = `INSERT INTO notifications(command, from_username, from_uuid, to_username, to_uuid, message, timestamp) VALUES ("${data.command}", "${data.from_username}", "${data.from_uuid}", "${data.to_username}", "${data.to_uuid}", "${data.message}", "${data.timestamp}")`
    console.log(my_query)
    const result = await db.query(my_query);
    let message = 'Error in creating notifications';
    if (result.affectedRows) {
      message = 'Notification created successfully';
    } 
    console.log(message)
    return {message};
  } catch (err){
    console.log(err.sqlMessage)
  }
}
module.exports = {
  getLogs,
  create
}