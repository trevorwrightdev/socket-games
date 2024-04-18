import { Socket, Server } from 'socket.io'
import { GameType, CustomSocket } from './lib/utils'
import { SocketGames } from './lib/SocketGames'
import SecretHitlerSockets from './lib/secrethitler/sockets'

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

    socket.on('resync', (lastWaitTimestamp: number) => {
        const game = socketGames.getRoomAndReplaceSocketID(socket.handshake.query.clientId, socket.id)
        if (!game) {
            console.log('room not found')
            socket.emit('error', 'Room not found.')
            return
        }

        const socketEvent = game.pastSocketEvents[socket.handshake.query.clientId]
        if (lastWaitTimestamp > socketEvent.timestamp) {
            console.log('client is ahead')
            return
        }

        io.to(socket.id).emit(socketEvent.event, socketEvent.data)

    })

    SecretHitlerSockets(io, socket, socketGames)
}