const { Router } = require("express");
const router = Router();
const {
    apiTest,
    redisInsert,
    getRedisAll,
    getMysqlAll,
    myqslInsert
} = require("../controllers/index.controllers");

router.get("/test", apiTest);

router.post("/redisInsert",redisInsert);
router.post("/mysqlInsert",myqslInsert);


router.get("/redisGetAll",getRedisAll);
router.get("/mysqlGetAll",getMysqlAll);

module.exports = {
    routes: router,
}