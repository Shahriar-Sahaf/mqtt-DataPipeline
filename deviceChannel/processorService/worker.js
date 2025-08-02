require('dotenv').config({path :require('path').resolve(__dirname,'../.env')});
const{ connectToMongoo, saveTomongo} = require('./DB/MongoDB/mongoose');
const {saveToPostgres,createTable} = require('./DB/pg/pg')
const {redisCache} = require('./DB/Redis/config')
const {getAndPublish} = require('./DB/Redis/getAndPublish')
const {redisClient} = require('./DB/Redis/redis')

const express = require('express');
const mqtt = require('mqtt');   
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = mqtt.connect(process.env.MQTT_BROKER_URL);
const port = process.env.WORKERPORT || 3001;
const topic = 'devices/telemetry/+';

client.on('connect',()=>{
    console.log(`Connected to MQTT Broker at ${process.env.MQTT_BROKER_URL}`);
    subscriber();
})


async function subscriber() {
    client.subscribe(topic, (error)=>{
        if (error) {
            console.error('Subscription Error:', error);
        }
        console.log(`Subscribed to devices/telemetry/+`);
    })
}


async function saveDataToDatabase(data){
    try {  
        await saveToPostgres(data);
        await saveTomongo(data);
        await redisCache(data);
        await getAndPublish(data.device);

    } catch (error) {
        console.error('Error saving OR cache data:', error);
    }
}

client.on('message',(topic, message) => {
    try {
        const data  = JSON.parse(message.toString());
        console.log(`Received message on ${topic}:`, data);
        saveDataToDatabase(data);
    } catch (error) {
        console.error('Error processing message:', error);
    }

});

async function checkConnections() {
    try {
        await createTable();
        await connectToMongoo();
        await redisClient.connect()
        console.log('Connected to Redis');
        app.listen(port,()=>{
             console.log(`Worker Server is running on port ${port}`);
        })

    } catch (error) {
        console.log('Connection Error :',error)
    }
    
}

checkConnections();

module.exports = { saveDataToDatabase };