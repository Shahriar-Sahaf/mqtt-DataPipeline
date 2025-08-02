# 🌐 IOT Data pipline With using MQTT , WebSocket & User Authentication


This is a processing pipeline project developed using a microservices architecture and also using MQTT & WebSocket protocol , this project include Two Channel. The first channel is responsible for establishing a  MQTT secure connection to create client and publish the data on specified topic , also this channel have worker service that subscribed to topic , first saves the device name into a PostgreSQL database, and then stores the whole message in MongoDB. After that, the data is cached in Redis. Using Redis Pub/Sub, the cached values are published. The second channel have two important responsiblity first , Authenticate users and generate JWT for them an then save into PostgreSQL , this JWT Ensure the socket.io secure connection,also in this channel after secure socket.io connection data are subscribe from cache and emited to Authenticated user. 

---

## Tech Stack

- **Node.js / Express.js** — Backend runtime and web framework
- **MongoDB** — Document-based NoSQL database
- **PostgreSQL** — Relational database for structured storage
- **Redis** — In-memory cache and Pub/Sub 
- **Socket.IO** — Real-time communication with clients
- **Jest** — Testing framework
- **MQTT** — publish-subscribe based messaging protocol 
- **JWT** — jsonwebtoken for Authenticate

---
##  Dependencies
This project uses the following this  npm packages:

- **express** – Web framework for building APIs
- **mongoose** – MongoDB ODM for data modeling
- **pg** – PostgreSQL client for Node.js
- **redis** – Redis client
- **nodemon** – automatically restarts your Node.js application
- **socket.io** – Websocket Libary
- **dotenv** – Loads environment variables from `.env` file
- **MQTT** – publish-subscribe based messaging protocol 
- **bcrypt** – A library to help you hash passwords
- **jsonwebtoken** –  implement secure authentication and authorization
- **jest** – Testing framework
- **supertest** – For testing HTTP APIs

## 🚀 Service Setup & Run Instructions

```bash
git clone https://github.com/Shahriar-Sahaf/mqtt-DataPipeline.git
cd [your-root]
```

# 1. deviceChannel

####  Installation
```bash
cd deviceChannel
npm install
```
## Install MQTT broker
1. download and install mosquitto : https://mosquitto.org/download/

 ```bash 
mosquitto -v

```
## 🐳 Install Docker & WSL (Windows)

1. Install WSL:  
wsl --install

2. Install Docker Desktop for Windows:  
https://www.docker.com/products/docker-desktop/

3. Ensure integration with WSL2 is enabled in Docker settings.

## Install Redis
```bash
docker run -d --texonaRedis redis -p 6379:6379 redis
```

## Install MongoDB  & Robo3t
1. Download from: https://www.mongodb.com/try/download/community  
2. Start mongod and connect to mongodb://localhost:27017
3. Download Robo3T : https://robomongo.org/download.php

##  Install PostgreSQL and DBeaver

PostgreSQL  
1. Download: https://www.postgresql.org/download/windows/  
2. Download DBeaver:https://dbeaver.io/download/

#### 🛠️ Start MQTTpublish Service

```bash
 cd deviceChannel\mqttChannel
 nodemon mqttpublish

```
#### 🛠️ Start Worker Service
```bash
 cd deviceChannel\processorService
 nodemon worker

```
> Ensure that:
> - MQTT is installed
> - MongoDB and PostgreSQL are installed and reachable
> - Redis is running on default port (6379)

---

# 3. userChannel
```bash
cd userChannel
npm install
```
#### 🛠️ Start Service

```bash
cd userChannel\server
nodemon app.js
```
#### 🛠️ login and realTime services

- go to http://localhost:4000/
- you can also use Postman to  see your JWT 

---

## Running Tests

- have Unit test for Worker service and Integration test for api 
- To run tests:

```bash
cd [deviceChannel OR userChannel]
npm test
```


## 🧑‍💻  Author

Created by [Shahriar Sahaf]