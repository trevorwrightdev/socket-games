import { Socket } from 'socket.io'
import { isValidGame, GameType } from './lib/utils'
import { SocketGames } from './lib/SocketGames'

export default function socketEvents(socket: Socket, socketGames: SocketGames) {
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
}