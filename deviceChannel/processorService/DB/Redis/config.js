

const {redisClient} = require('./redis')


async function redisCache(data) {
    try {

        const key = `device:${data.device}`;
        await redisClient.set(key, JSON.stringify(data), {
            EX: 60 * 10,
        });
        console.log('Data Cache Successfully');

    } catch (error) {
        console.log('Error to Cache in redis',error)
        throw error
    }
    
}

module.exports = {redisCache}