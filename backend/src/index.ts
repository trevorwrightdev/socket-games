import express from 'express'
import { Server as SocketIOServer } from 'socket.io'
import http from 'http'
import { GameType, isValidGame } from './lib/utils'
import { SocketGames } from './lib/SocketGames'

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

// Initialize SocketGames
const socketGames = new SocketGames()

// Handle a connection
io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected.`)

    socket.on('createRoom', (gameType: GameType) => {
        if (!isValidGame(gameType)) {
            socket.emit('error', 'Invalid game type.')
            return
        }

        socketGames.createRoom(gameType, socket)
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
