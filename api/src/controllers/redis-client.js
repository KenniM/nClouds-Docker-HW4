const docker = require('docker-secret');
const redis = require('redis');
const { promisify } = require('util');
const client = redis.createClient({
    url: "redis://redis_db_s:6379",
    password: docker.secrets.REDIS_PASSWORD
});
client.connect();

client.on("error", (error) => {
    console.error(`Error to connect Redis: ${error}`);
});

module.exports = {
    client
}