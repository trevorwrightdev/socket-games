import { Socket, Server } from 'socket.io'
import { GameType } from './lib/utils'
import { SocketGames } from './lib/SocketGames'

export default function socketEvents(io: Server, socket: Socket, socketGames: SocketGames) {
    console.log(`User ${socket.id} connected.`)

    socket.on('createRoom', (gameType: GameType) => {
        socketGames.createRoom(gameType, socket)
    })

    socket.on('joinRoom', ({ code, name }) => {
        socketGames.joinRoom(code, name, socket, io)
    })

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected.`)
    })
}