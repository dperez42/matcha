const db = require('../services/db.js');

////// GET tags ////////
async function get(uuid){
  //console.log(`SELECT *  FROM tags WHERE uuid = "${uuid}"`)
  const data = await db.query(
    `SELECT * 
    FROM tags
    WHERE uuid = "${uuid}"
    `
  );
  return data
}
/// Get distinct tags
async function getDistinct(uuid){
  //console.log(`SELECT distinct(tag) FROM tags`)
  const data = await db.query(
    `SELECT distinct(tag)
    FROM tags
    `
  );
  return data
}
////// CREATE tag////////
async function create(uuid, tag){
  try {
    const result = await db.query(
      `INSERT INTO tags (uuid, tag) 
      VALUES ("${uuid}", "${tag}")`
    );
  let message = 'Error in creating tag';
  if (result.affectedRows) {
    message = 'tag created successfully';
    //console.log(result)
    //console.log(message)
  } 
  return {message};
  //console.log(message)
  //return {message};
  } catch (err){
    //console.log(err.sqlMessage)
  }
}
////// UPDATE tag ////////

/////// REMOVE tag///////
async function remove(uuid){
  const result = await db.query(
    `DELETE FROM tags WHERE uuid="${uuid}"`
  );
  let message = 'Error in deleting tag';
  if (result.affectedRows) {
    message = 'tag deleted successfully';
  }

  return {message};
}

module.exports = {
    get,
    getDistinct,
    create,
    remove,
  }