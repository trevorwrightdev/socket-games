import express from 'express'
import { Server as SocketIOServer } from 'socket.io'
import http from 'http'
import { SocketGames } from './lib/SocketGames'
import routes from './routes'
import socketEvents from './sockets'
import cors from 'cors'

require('dotenv').config()

// Initialize express app and HTTP server
const app = express()
const server = http.createServer(app)

app.use(cors({
    origin: process.env.FRONTEND_URL
}))

// Initialize Socket.IO server
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL
  }
})

// Initialize SocketGames
const socketGames = new SocketGames()

// Handle a connection
io.on('connection', (socket) => {
    socketEvents(io, socket, socketGames)
})

// Set up routes
app.use(routes(socketGames))

// Start the server
const PORT = process.env.PORT || 3002
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`)
})
