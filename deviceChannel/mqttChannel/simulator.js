require('dotenv').config({path :require('path').resolve(__dirname,'../.env')});

const mqtt =require('mqtt')


function generateTelemetry(device) {
    return {
        device,
        temperature: Math.floor(Math.random() * 30),
        humidity: Math.floor(Math.random() * 30)
    };
}

async function mqttSimulator() {
    const client = mqtt.connect(process.env.MQTT_BROKER_URL, {
     username: process.env.MQTT_USERNAME,
     password: process.env.MQTT_PASSWORD
    });
    client.on('connect', () => {
        console.log(`Connecting to MQTT Broker at ${process.env.MQTT_BROKER_URL}`);
        const deviceIds = [8515, 4422, 1288];
        setInterval(() => {
            const device = deviceIds[Math.floor(Math.random() * deviceIds.length)];
            const data = generateTelemetry(device);
            const message = JSON.stringify(data);
            const topic = `devices/telemetry/${device}`;
            client.publish(topic, message , (error) => {
                if (error) {
                        console.error('Publish Error:', error);
                        return;
                    }
                    console.log('Message Published:', message);
                });


            }, 5000);
            client.on('error', (error) => {
                console.error('MQTT Client Error:', error);
            });

        });
        
}

module.exports = {mqttSimulator};