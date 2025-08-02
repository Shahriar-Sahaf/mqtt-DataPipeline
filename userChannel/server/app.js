require('dotenv').config({path :require('path').resolve(__dirname,'../.env')});

const {userLogin} = require('../authservice/userAuth')

const socketio = require('socket.io')
const express = require('express')
const app = express()
const http =require('http')
const server = http.createServer(app)
const io = socketio(server)
const redis = require('redis')
const jwt = require('jsonwebtoken')
const client = redis.createClient()
const path = require('path')
const {createUserTable}= require('../DB/pg')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))



const clientDirectory = path.join(__dirname,'../client')
app.use(express.static(clientDirectory))

const port = process.env.PORT || 4000

app.post('/auth/login',userLogin)

io.use((socket, next) => {

    let token = socket.handshake.auth?.token;
    if (!token) {
        const authHeader = socket.handshake.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }
    if (!token) {
        return next(new Error('Authentication error: Token required'));
    }
  try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          socket.user = decoded; 
          next();
        } catch (error) {
          return next(new Error('Authentication error: Invalid token'));
        }
    });

    

    
async function startServer() {
  try {

    await client.connect()
    client.subscribe(process.env.REDIS_PUBLISH_CHANNEL,(msg)=>{

      const data = JSON.parse(msg)
      console.log(`${msg} is Subscribed `)
      io.emit('emitData',data)
      if (io.sockets.sockets.size > 0) {
         console.log('Data emited Successfully')
      }
   
    })

      
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })

  } catch (error) {
    console.log('Error from Subscribe : ',error)
    throw error;
  }
  
}

io.on('connection',(socket)=>{
  console.log('Websocket Connected')

  socket.on('disconnect',()=>{
    console.log('Websocket Disconnet')
  })
})

startServer()
createUserTable();