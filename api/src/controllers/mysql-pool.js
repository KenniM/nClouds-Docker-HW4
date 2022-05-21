const keys = require("./creds");
const mysql = require("mysql2");
const mysqlPool = mysql.createPool(keys.mysql);


module.exports=mysqlPool;