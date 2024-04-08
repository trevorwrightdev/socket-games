import { SecretHitler } from './secrethitler'
import { GameType, isValidGame } from './utils'
import { CodeGenerator } from './codegenerator'
import { Server, Socket } from 'socket.io'
import Game from './Game'

type RoomCodeToGame = {
    [key: string]: SecretHitler
}

type UserToRoomCode = {
    [key: string]: string
}

export class SocketGames {
    private roomCodeToGame: RoomCodeToGame = {}
    private userToRoomCode: UserToRoomCode = {}

    public createRoom(gameType: GameType, socket: Socket) {
        if (!isValidGame(gameType)) {
            socket.emit('error', 'Invalid game type.')
            return
        }

        let roomCode = ''
        do {
            roomCode = CodeGenerator.generate()
        } while (this.roomCodeToGame[roomCode])

        let game = new Game()
        if (gameType === 'Secret Hitler') {
            game = new SecretHitler()
        }

        this.roomCodeToGame[roomCode] = game
        this.userToRoomCode[socket.id] = roomCode
        game.host = socket.id

        socket.join(roomCode)
        console.log(`User ${socket.id} created room ${roomCode} for game ${gameType}.`)
        socket.emit('roomCreated', roomCode)
    }

    public joinRoom(code: string, name: string, socket: Socket, io: Server) {
        if (!this.codeIsValid(code)) {
            socket.emit('error', 'Invalid room code.')
            return
        } 

        if (name === '' || name.length > 10) {
            socket.emit('error', 'Invalid name.')
            return
        }

        const game = this.roomCodeToGame[code]
        game.addPlayer(socket.id, name)
        socket.join(code)
        
        console.log(`User ${socket.id} joined room ${code}.`)

        const gameType = game.gameType
        socket.emit('roomJoined', {
            gameType,
            name,
            roomCode: code,
        })
        io.to(game.host).emit('playerJoined', game.getPlayers())
    }

    public codeIsValid(code: string): boolean {
        return !!this.roomCodeToGame[code]
    }

}