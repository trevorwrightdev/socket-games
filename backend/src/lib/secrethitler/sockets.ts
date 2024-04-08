import { Socket, Server } from 'socket.io'
import { SocketGames } from '../SocketGames'
import { SecretHitler } from './secrethitler'

export default function SecretHitlerSockets(io: Server, socket: Socket, socketGames: SocketGames) {
    socketGames.On('startGame', socket, ({ game }) => {
        if (game.host !== socket.id) {
            socket.emit('error', 'You are not the host.')
            return
        }

        (game as SecretHitler).startGame()
        io.to(game.roomCode).emit('gameStarted')
    })
}