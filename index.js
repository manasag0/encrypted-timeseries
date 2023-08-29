const express = require('express')
const  bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config();
const mongoose = require('mongoose');
const crypto =require('crypto');
const { create } = require('domain');
// const { response } = require('../node-mastery/express-server');
const secret_key = crypto.randomBytes(32);
// aes-256-ctr

const cipher = crypto.createCipheriv('aes-256-ctr',secret_key)

const app = express();
app.use(cors())
app.use(bodyParser.json())

mongoose.connect(process.env.STORE)
.then((response)=>{
  console.log("connced to db")
})
.catch((err=>{
  console.log("Connection failed",err)
}))

app.listen(3000, ()=>{
  console.log("server running on port number 3000")
})




















































// const net = require('net');
// const crypto = require('crypto');
// const data = require('./data.json');

// const server = net.createServer(socket => {
//   console.log('Emitter connected');

//   const interval = setInterval(() => {
//     const messageCount = Math.floor(Math.random() * (499 - 49 + 1)) + 49;
//     const encryptedMessages = [];

//     for (let i = 0; i < messageCount; i++) {
//       const randomIndex = Math.floor(Math.random() * data.length);
//       const randomData = data[randomIndex];
//       const secretKey = crypto.createHash('sha256').update(JSON.stringify(randomData)).digest('hex');
//       const payload = {
//         ...randomData,
//         secret_key: secretKey
//       };
//       const encryptedMessage = encryptPayload(payload);
//       encryptedMessages.push(encryptedMessage);
//     }

//     const dataStream = encryptedMessages.join('|');
//     socket.write(dataStream);
//   }, 5000); // Send data every 5 seconds

//   socket.on('close', () => {
//     clearInterval(interval);
//     console.log('Emitter disconnected');
//   });
// });

// function encryptPayload(payload) {
//   const key = crypto.randomBytes(32); // AES-256 key size
//   const iv = crypto.randomBytes(16); // Initialization vector
//   const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
//   const encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'hex') + cipher.final('hex');
//   return encrypted;
// }

// server.listen(3000, () => {
//   console.log('Emitter listening on port 3000');
// });
