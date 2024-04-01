import express from 'express'
import { Server as SocketIOServer } from 'socket.io'
import http from 'http'

// Initialize express app and HTTP server
const app = express();
const server = http.createServer(app)

// Initialize Socket.IO
const io = new SocketIOServer(server)

// Serve a simple test route
app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>')
});

// Handle a connection
io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

// Start the server
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`)
})
