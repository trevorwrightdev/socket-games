import { Socket, Server } from 'socket.io'
import { GameType } from './lib/utils'
import { SocketGames } from './lib/SocketGames'
import SecretHitlerSockets from './lib/secrethitler/sockets'

export default function socketEvents(io: Server, socket: Socket, socketGames: SocketGames) {
    console.log(`User ${socket.id} connected.`)

    socket.on('createRoom', (gameType: GameType) => {
        socketGames.createRoom(gameType, socket)
    })

    socket.on('joinRoom', ({ code, name }) => {
        socketGames.joinRoom(code, name, socket, io)
    })

    socket.on('disconnect', () => {
        // TODO: Handle disconnections by removing the player from the game only if the game hasnt started yet 
        console.log(`User ${socket.id} disconnected.`)
    })

    SecretHitlerSockets(io, socket, socketGames)
}