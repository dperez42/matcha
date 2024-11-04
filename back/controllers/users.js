const db = require('../services/db.js');
const helper = require('../helpers.js');
const config = require('../config.js');
const smtp = require('../services/email.js');
const bcrypt = require('../services/bcrypt.js');
const moment = require('moment');

////// GET ////////
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

async function getOnes(where_clause, order_by_clause, select_clause){
  let tmp = ''
  if (!select_clause){
    select_clause=''
  }
  if (select_clause===', '){
    select_clause=''
  }
  if (where_clause!='' & where_clause!= undefined){
    tmp = 'WHERE ' + where_clause
  }
  if (order_by_clause!='' & order_by_clause != undefined){
    tmp = tmp + 'ORDER BY '+ order_by_clause
  }
  console.log("this is the order ", order_by_clause)
  console.log(`SELECT * ${select_clause}  FROM users ${tmp}`)
  
  const data = await db.query(
    `SELECT * ${select_clause}
    FROM users
    ${tmp}
    `
  );
  //console.log("result:",data)
  // const data = helper.emptyOrRows(rows);
  return data
}

async function getCards(where_clause, order_by_clause, select_clause, user_uuid, limit_tags){
  let tmp = ''
  if (!select_clause){
    select_clause=''
  }
  if (select_clause===', '){
    select_clause=''
  }
  if (where_clause!='' & where_clause!= undefined){
    tmp = 'WHERE ' + where_clause + 
      ' and (CASE WHEN t0.nb_tags IS NULL THEN 0 ELSE t0.nb_tags END >='+limit_tags[0]+' and CASE WHEN t0.nb_tags IS NULL THEN 0 ELSE t0.nb_tags END <='+limit_tags[1]+') ' 
  }
  if (order_by_clause!='' & order_by_clause != undefined){
    tmp = tmp + 'ORDER BY '+ order_by_clause
  }
  console.log("this is the order ", order_by_clause)
  console.log(`SELECT users.* ,${select_clause},
  CASE WHEN t0.nb_tags IS NULL THEN 0
  ELSE t0.nb_tags END
    as common_tags 
  FROM users
  left join (
  SELECT t1.uuid as us,t2.uuid as mate, count(t2.tag) as nb_tags FROM tags as T1
  left join tags as T2
  on t1.tag = T2.tag
  where t1.uuid="${user_uuid}" and t2.uuid!="${user_uuid}"
  group by t1.uuid,t2.uuid) as t0
  on t0.mate = users.uuid
  ${tmp}`)
  
  const data = await db.query(
    `SELECT users.* ,${select_clause},
        CASE WHEN t0.nb_tags IS NULL THEN 0
        ELSE t0.nb_tags END
          as common_tags 
    FROM users
    left join (
      SELECT t1.uuid as us,t2.uuid as mate, count(t2.tag) as nb_tags FROM tags as T1
      left join tags as T2
      on t1.tag = T2.tag
      where t1.uuid="${user_uuid}" and t2.uuid!="${user_uuid}"
      group by t1.uuid,t2.uuid) as t0
      on t0.mate = users.uuid
      ${tmp}
    `
  );
  //console.log("result:",data)
  // const data = helper.emptyOrRows(rows);
  return data
}

////// CREATE ////////
async function create(data){
  try {
  //console.log(`INSERT INTO users(uuid, password, email, username, first, last) 
  //VALUES (UUID(), ${data.password}, ${data.email}, ${data.username}, ${data.first},${data.last})`)
  const hash_password = await bcrypt.hashPassword(data.password)
  
  let user_date = ""
  if (!data.date){
    user_date = '1970-07-31 03:35:00'
  } else {
    user_date = data.date
  }
  
  const result = await db.query(
    `INSERT INTO users(uuid, password, email, username, first, last, longitude, latitude, date, verificated) 
    VALUES (UUID(), "${hash_password}", "${data.email}", "${data.username}", "${data.first}", "${data.last}", "${data.lon}", "${data.lat}", "${user_date}", 1)`
  );
  let message = 'Error in creating users';
  if (result.affectedRows) {
    message = 'User created successfully';
    console.log(result)
    console.log(message)

    //send verify email
    //smtp.email(data.email,"12345");
  } 
  return {message};
  //console.log(message)
  //return {message};
  } catch (err){
    console.log(err.sqlMessage)
  }
}
////// UPDATE PASSWORD ////////
async function updatePassword(data){
  try {
    //console.log(`INSERT INTO users(uuid, password, email, username, first, last) 
    //VALUES (UUID(), ${data.password}, ${data.email}, ${data.username}, ${data.first},${data.last})`)
    const hash_password = await bcrypt.hashPassword(data.password)
    const result = await db.query(
      `UPDATE users SET password = "${hash_password}"
      WHERE uuid = "${data.uuid}"`
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
  let current_date = moment(user.date).format("YYYY-MM-DD");
  console.log(`UPDATE users 
  SET username="${user.username}", email="${user.email}", completed=1,
  title="${user.title}", first="${user.first}", last="${user.last}", date="${current_date}", 
  gender="${user.gender}", sexual="${user.sexual}", 
  phone="${user.phone}", cell="${user.cell}", 
  address="${user.address}", city="${user.city}",state="${user.state}", zip="${user.zip}", country="${user.country}",
  bio="${user.bio}", tags="${user.tags}", 
  avatar="${user.avatar}",img1="${user.img1}",img2="${user.img2}",img3="${user.img3}",img4="${user.img4}"
  WHERE uuid="${uuid}"`)
  
  const result = await db.query(
    `UPDATE users 
    SET username="${user.username}", email="${user.email}", completed=1,
    title="${user.title}", first="${user.first}", last="${user.last}", date="${current_date}", 
    gender="${user.gender}", sexual="${user.sexual}", 
    phone="${user.phone}", cell="${user.cell}", 
    address="${user.address}", city="${user.city}",state="${user.state}", zip="${user.zip}", country="${user.country}",
    bio="${user.bio}", tags="${user.tags}", 
    avatar="${user.avatar}",img1="${user.img1}",img2="${user.img2}",img3="${user.img3}",img4="${user.img4}"
    WHERE uuid="${uuid}"` 
  );

  let message = 'Error in updating profile';

  if (result.affectedRows) {
    message = 'Profile update';
  }

  return {message};
}
// Update image
async function updateImage(uuid, image, id){
  const result = await db.query(
    `UPDATE users 
    SET ${image}="${image}"
    WHERE uuid="${uuid}"` 
  );
  let message = 'Error in updating lastseen';

  if (result.affectedRows) {
    message = 'Image load';
  }
  return {message};
}
// Update lastseen
async function updateLastSeen(uuid, time){
  console.log("kkjjk",uuid,"   ",time )
  const result = await db.query(
    `UPDATE users 
    SET lastseen="${time}"
    WHERE uuid="${uuid}"` 
  );
  let message = 'Error in updating lastseen';

  if (result.affectedRows) {
    message = 'Lastseen update';
  }
  return {message};
}
// Update rating
async function updateRating(uuid, nb){
  const result = await db.query(
    `UPDATE users 
    SET rating=rating+${nb}
    WHERE uuid="${uuid}"` 
  );
  console.log(`UPDATE users 
  SET rating=rating+${nb}
  WHERE uuid="${uuid}"`)
  console.log(result)
  let message = 'Error in updating rating';

  if (result.affectedRows) {
    message = 'Rating update';
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

module.exports = {
    getMultiple,
    getOnes,
    getCards,
    create,
    updateProfile,
    updatePassword,
    updateImage,
    updateLastSeen,
    updateRating,
    remove,
  }