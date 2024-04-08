import { SecretHitler } from './secrethitler/secrethitler'
import { GameType, isValidGame } from './utils'
import { CodeGenerator } from './codegenerator'
import { Server, Socket } from 'socket.io'
import Game from './Game'

type RoomCodeToGame = {
    [key: string]: Game
}

type UserToRoomCode = {
    [key: string]: string
}

type OnEventCallback = (args: { game: Game }) => void

export class SocketGames {
    public roomCodeToGame: RoomCodeToGame = {}
    public userToRoomCode: UserToRoomCode = {}

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
        game.roomCode = roomCode
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

        if (game.getPlayers().length >= game.maxPlayers) {
            socket.emit('error', 'Room is full.')
            return
        }

        if (game.inProgress) {
            socket.emit('error', 'Game has already started.')
            return
        }

        this.userToRoomCode[socket.id] = code
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

    public On(eventName: string, socket: Socket, callback: OnEventCallback) {
        socket.on(eventName, () => {
            const game = this.roomCodeToGame[this.userToRoomCode[socket.id]]
            if (!game) {
                socket.emit('error', 'You are not in a room.')
                return
            }
            callback({ game })
        })
    }

    public Broadcast(eventName: string, io: Server, game: Game, data?: any) {
        io.to(game.host).emit(eventName, data)
        for (const player of game.getPlayers()) {
            io.to(player.socketId).emit(eventName, data)
        }
    }
}