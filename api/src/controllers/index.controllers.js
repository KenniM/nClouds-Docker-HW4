const redisClient = require("./redis-client");
const mysqlPool = require("./mysql-pool");

async function apiTest(req, res, next) {
    try {
        res.json({
            message: "OK"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message || "An error ocurred in API."
        })
    }
}

async function redisInsert(req, res, next) {
    try {
        let { name, email } = req.body;

        const data = await redisClient.client.get(email);

        if (data === null) {
            await redisClient.client.set(email, name);
            res.status(200).json({
                message: "OK"
            });
        } else {
            res.status(305).json({
                message: "Email already exists on Redis DB."
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message || "An error ocurred when trying to connect to Redis."
        })
    }
}

async function getRedisAll(req, res, next) {
    try {
        const data = await redisClient.client.dbSize();

        res.json({"count":data});

    } catch (error) {
        res.status(500).json({
            message: error.message || "An error ocurred when trying to connect to Redis."
        })
    }
}

async function getMysqlAll(req, res, next) {
    try {
        var query = "SELECT COUNT(*) as count FROM users;";
        mysqlPool.query(query, function (err, result) {
            if (err) console.log(err);
            res.send(result);
        })
    } catch (error) {
        res.status(500).json({
            message: error.message || "An error ocurred when fetching data from MySQL."
        })
    }
}

async function myqslInsert(req, res, next) {
    try {
        var { name, email } = req.body;

        var searchQuery = `SELECT COUNT(*) count FROM users WHERE email='${email}';`;

        mysqlPool.query(searchQuery, function (err, result) {
            if (err) console.log(err);
            if (result[0].count > 0) {
                res.status(305).json({ "noInsert": "The email is already registered." })
            } else {
                var query = `INSERT INTO users(email,name) VALUES('${email}','${name}');`;

                mysqlPool.query(query, function (err, result) {
                    if (err) {
                        res.status(500).json({ "Error": err.message });
                    }
                });
                res.status(200).json({ "message": "OK" });
            }
        })
    } catch (error) {
        res.status(500).json({
            message: error.message || "An error ocurred when trying to insert data in MySQL."
        })
    }
}

module.exports = {
    apiTest,
    redisInsert,
    getRedisAll,
    getMysqlAll,
    myqslInsert,
};