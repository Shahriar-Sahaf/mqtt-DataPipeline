
const {redisClient} = require('./redis')



async function getAndPublish(deviceId) {
    try { 
         const data = await redisClient.get(`device:${deviceId}`);
     if (!data) {
        console.log(`No cached data found for device ${deviceId}`);
      }
         await redisClient.publish(process.env.REDIS_PUBLISH_CHANNEL, data);
         console.log(`Data for device ${deviceId} published to Redis channel`);
    } catch (error) {
        console.error('Error fetching data from Redis:', error);
        throw error
    }
   
}

module.exports = {getAndPublish}