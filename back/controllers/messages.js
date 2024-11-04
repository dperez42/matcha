const db = require('../services/db.js');
const helper = require('../helpers.js');
const config = require('../config.js');
const smtp = require('../services/email.js');
const bcrypt = require('../services/bcrypt.js');
const date = require('date-and-time')

////// GET ////////
/*
async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT id, name, released_year, githut_rank, pypl_rank, tiobe_rank 
    FROM programming_languages LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}
*/
async function getMessages(where_clause){
  let tmp = ''
  if (where_clause!='' & where_clause!= undefined){
    tmp = 'WHERE ' + where_clause
  }
  const data = await db.query(
    `SELECT * 
    FROM messages
    ${tmp}
    ORDER BY timestamp ASC
    `
  );
  //console.log(data) 
  //  OFFSET (SELECT count(*) FROM messages)-1 puede ser negativo----
  // const data = helper.emptyOrRows(rows);
  return data
}

////// CREATE ////////
async function create(data){
  console.log(data)
  try {
  //console.log(`INSERT INTO users(uuid, password, email, username, first, last) 
  const result = await db.query(
    `INSERT INTO messages(from_uuid, from_username, to_uuid, to_username, timestamp, message)
    VALUES ("${data.from_uuid}", "${data.from_username}", "${data.to_uuid}", "${data.to_username}","${data.timestamp}", "${data.message}")`
  );
  let message = 'Error in insert messages';
  if (result.affectedRows) {
    message = 'Message insert successfully';
    console.log(result)
    //send verify email
    //smtp.email(data.email,"12345");
  } 
  console.log(message)
  return {message};
  } catch (err){
    console.log(err.sqlMessage)
  }
}
////// UPDATE PASSWORD ////////
/*
async function updatePassword(data){
  try {
    //console.log(`INSERT INTO users(uuid, password, email, username, first, last) 
    //VALUES (UUID(), ${data.password}, ${data.email}, ${data.username}, ${data.first},${data.last})`)
    const hash_password = await bcrypt.hashPassword(data.password)
    const result = await db.query(
      `UPDATE users SET password = "${hash_password}"
      WHERE email = "${data.email}"`
    );
    let message = 'Error in creating users';
    if (result.affectedRows) {
      message = 'User update successfully';
      console.log(result)
    } 
    console.log(message)
    return {message};
  } catch (err){
    console.log(err.sqlMessage)
  }
}
////// UPDATE PROFILE ////////
async function updateProfile(uuid, user){
  const result = await db.query(
    `UPDATE users 
    SET username="${user.username}", email="${user.email}", completed=1,
    title="${user.title}", first="${user.first}", last="${user.last}", 
    gender="${user.gender}", sexual="${user.sexual}", 
    city="${user.city}",address="${user.address}", zip="${user.zip}", country="${user.country}",
    bio="${user.bio}",
    img4="${user.img4}"
    WHERE uuid="${uuid}"` 
  );

  let message = 'Error in updating profile';

  if (result.affectedRows) {
    message = 'Profile update';
  }

  return {message};
}
/////// REMOVE ///////
async function remove(uuid){
  const result = await db.query(
    `DELETE FROM users WHERE uuid="${uuid}"`
  );
  let message = 'Error in deleting user';
  if (result.affectedRows) {
    message = 'user deleted successfully';
  }

  return {message};
}
*/
module.exports = {
    //getMultiple,
    getMessages,
    create,
    //updateProfile,
    //updatePassword,
    //remove,
  }