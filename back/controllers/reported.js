const db = require('../services/db.js');

////// CREATE ////////
async function create(data){
  try {
    const my_query = `INSERT INTO reported(command, from_username, from_uuid, to_username, to_uuid, message, timestamp) VALUES ("${data.command}", "${data.from_username}", "${data.from_uuid}", "${data.to_username}", "${data.to_uuid}", "${data.message}", "${data.timestamp}")`
    console.log(my_query)
    const result = await db.query(my_query);
    let message = 'Error in creating reported';
    if (result.affectedRows & result2.affectedRows) {
      message = 'Reported created successfully';
    } 
    console.log(message)
    return {message};
  } catch (err){
    console.log(err.sqlMessage)
  }
}


module.exports = {
  create,
}