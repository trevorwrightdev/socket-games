import express from 'express'
import { Server as SocketIOServer } from 'socket.io'
import http from 'http'
import { CodeGenerator } from './lib/codegenerator'
import { GameType, Games } from './lib/utils'
import { defaultSecretHitlerGameState } from './lib/secrethitler'

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

const games: Games = {}

// Handle a connection
io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected.`)

    socket.on('createRoom', (gameType: GameType) => {
        let roomCode = ''
        do {
            roomCode = CodeGenerator.generate()
        } while (games[roomCode])

        if (gameType === 'Secret Hitler') {
            games[roomCode] = defaultSecretHitlerGameState
        }

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
