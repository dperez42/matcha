const db = require('../services/db.js');

////// GET /////// 
async function getOnes(where_clause, order_by_clause){
  try {
    let tmp = ''
    if (where_clause!='' & where_clause!= undefined){
      tmp = 'WHERE ' + where_clause
    }
    if (order_by_clause!='' & order_by_clause != undefined){
      tmp = tmp + 'ORDER BY '+ order_by_clause
    }
    console.log(`SELECT * FROM blocked ${tmp}`)
    const data = await db.query(
      `SELECT * FROM matched ${tmp}`
    );
    console.log(data)
    return data
  } catch (err){
    console.log(err.sqlMessage)
  }
}

////// CREATE ////////
async function create(data){
  try {
    const my_query = `INSERT INTO matched(from_uuid, to_uuid, timestamp) VALUES ( "${data.from_uuid}", "${data.to_uuid}", "${data.timestamp}")`
    const result = await db.query(my_query);
    let message = 'Error in creating like';
    if (result.affectedRows) {
      message = 'Like created successfully in database';
    } 
    console.log(message)
    return {message};
  } catch (err){
    console.log(err.sqlMessage)
  }
}
/////// REMOVE ///////
async function remove(data){
  try {
    const my_query =`DELETE FROM matched WHERE to_uuid="${data.to_uuid}" AND from_uuid="${data.from_uuid}"`
    
    console.log(my_query)
    const result = await db.query(my_query);
    let message = 'Error in deleting like';
    if (result.affectedRows) {
      message = 'like deleted successfully';
    }
    console.log(message)
    return {message};
  } catch (err){
    console.log(err.sqlMessage)
  }
}

module.exports = {
  getOnes,
  create,
  remove
}