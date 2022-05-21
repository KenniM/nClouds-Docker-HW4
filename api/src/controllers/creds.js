const docker = require('docker-secret');
let keys = {
    mysql:{
        host: "mysql_db",
        user: "root",
        password: docker.secrets.mysql_root_password,
        database: "hw4"
    }
}

module.exports=keys;