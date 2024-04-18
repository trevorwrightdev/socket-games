import { Socket, Server } from 'socket.io'
import { GameType, CustomSocket } from './lib/utils'
import { SocketGames } from './lib/SocketGames'
import SecretHitlerSockets from './lib/secrethitler/sockets'
import Game from './lib/Game'

export default function socketEvents(io: Server, socket: CustomSocket, socketGames: SocketGames) {
    console.log(`User ${socket.handshake.query.clientId} connected.`)

    socket.on('createRoom', (gameType: GameType) => {
        socketGames.createRoom(gameType, socket)
    })

    socket.on('joinRoom', ({ code, name }) => {
        socketGames.joinRoom(code, name, socket, io)
    })

    socket.on('disconnect', () => {
        // TODO: Handle disconnections by removing the player from the game only if the game hasnt started yet 
        console.log(`User ${socket.handshake.query.clientId} disconnected.`)
    })

    socket.on('resync', () => {
        const roomCode = socketGames.userToRoomCode[socket.handshake.query.clientId]
        const game = socketGames.roomCodeToGame[roomCode]
        if (!game) {
            socket.emit('error', 'Room not found.')
            return
        }

        game.swapSocketId(socket.handshake.query.clientId, socket.id)

        const socketEvent = game.pastEmitEvents[socket.handshake.query.clientId]
        const lastSendEventTimestamp = game.sendEventTimestamps[socket.handshake.query.clientId] || 0
        if (lastSendEventTimestamp > socketEvent.timestamp) {
            return
        }

        socketGames.EmitToID(socket.id, socketEvent.event, io, socket, socketEvent.data)
    })

    SecretHitlerSockets(io, socket, socketGames)
}