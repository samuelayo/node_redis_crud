//check if we re in test environment to use redis-mock or else, use normal redis
if(process.env.NODE_ENV == 'test'){
    var redis = require("redis-mock"),
    client = redis.createClient();
}else{
    //require redis
    var redis = require('redis');
    //create a redis client, pass in the redis uri
    var client = redis.createClient('redis://'+process.env.REDIS_HOST+':'+process.env.REDIS_PORT);
}
//export the connection client, so it can be accesed in other apps.
module.exports = client;