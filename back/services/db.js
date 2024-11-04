//https://blog.logrocket.com/build-rest-api-node-express-mysql/

//const pgp = require('pg-promise')(/* options */) //https://expressjs.com/en/guide/database-integration.html#postgresql
const mysql = require('mysql2/promise');

async function query(sql, params) {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        connectTimeout: 60000
    });
    //console.log(connection)
    const [results, ] = await connection.execute(sql, params);
    connection.close()
    return results;
}
  
module.exports = {
    query
}