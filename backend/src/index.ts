import express from 'express'
import { Server as SocketIOServer } from 'socket.io'
import http from 'http'
import { CodeGenerator } from './lib/codegenerator'
import { GameType } from './lib/types'

require('dotenv').config()

// Initialize express app and HTTP server
const app = express();
const server = http.createServer(app)

// Initialize Socket.IO server
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL
  }
})

// Serve a simple test route
app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>')
})

// Handle a connection
io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected.`)

    socket.on('createRoom', (gameType: GameType) => {
        const roomCode = CodeGenerator.generate()
        socket.join(roomCode)
        console.log(`User ${socket.id} created room ${roomCode} for game ${gameType}.`)
        socket.emit('roomCreated', roomCode)
    })

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected.`)
    })
})

// Start the server
const PORT = process.env.PORT || 3002
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`)
})
