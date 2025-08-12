require('dotenv').config({path :require('path').resolve(__dirname,'../.env')});

const express = require('express');
const app = express();
const {mqttSimulator} = require('./simulator')


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

try {
  mqttSimulator();
  console.log('MQTT Simulator start');
} catch (err) {
  console.error('Failed to start MQTT Simulator:', err);
}

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
