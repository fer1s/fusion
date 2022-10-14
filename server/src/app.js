require('dotenv').config()
require('./database')
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
   cors: {
       origin: "*"
   }
});
const cors = require('cors')

global.io = io
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', require('./routes'))

require('./socket')

server.listen(PORT, () => {
   console.log(`fusion | server listening on ${PORT}`)
})
