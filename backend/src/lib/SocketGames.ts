import { SecretHitlerGameState, getDefaultSecretHitlerGameState } from './secrethitler'
import { GameType } from './utils'
import { CodeGenerator } from './codegenerator'
import { Socket } from 'socket.io'

type RoomCodeToGame = {
    [key: string]: SecretHitlerGameState
}

type UserToRoomCode = {
    [key: string]: string
}

export class SocketGames {
    private roomCodeToGame: RoomCodeToGame = {}
    private userToRoomCode: UserToRoomCode = {}

    public createRoom(gameType: GameType, socket: Socket) {
        let roomCode = ''
        do {
            roomCode = CodeGenerator.generate()
        } while (this.roomCodeToGame[roomCode])

        if (gameType === 'Secret Hitler') {
            const defaultState = getDefaultSecretHitlerGameState()
            defaultState.players.push(socket.id)
            this.roomCodeToGame[roomCode] = defaultState
            this.userToRoomCode[socket.id] = roomCode
        }

        socket.join(roomCode)
        console.log(`User ${socket.id} created room ${roomCode} for game ${gameType}.`)
        socket.emit('roomCreated', roomCode)
    }

}