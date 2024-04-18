import { SecretHitler } from './secrethitler/secrethitler'
import { GameType, isValidGame, CustomSocket } from './utils'
import { CodeGenerator } from './codegenerator'
import { Server } from 'socket.io'
import Game from './Game'

type RoomCodeToGame = {
    [key: string]: Game
}

type UserToRoomCode = {
    [key: string]: string
}

type OnEventCallback = (args: { game: Game, data?: any }) => void

export class SocketGames {
    public roomCodeToGame: RoomCodeToGame = {}
    public userToRoomCode: UserToRoomCode = {}

    public getRoomAndReplaceSocketID(clientId: string, newSocketId: string) {
        const roomCode = this.userToRoomCode[clientId]

        if (!roomCode) {
            return null
        }

        const game = this.roomCodeToGame[roomCode]

        if (!game) {
            return null
        }

        const player = game.players.find(player => player.clientId === clientId)

        if (player) {
            player.socketId = newSocketId
        }

        return game
    }

    public createRoom(gameType: GameType, socket: CustomSocket) {
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
        this.userToRoomCode[socket.handshake.query.clientId] = roomCode
        game.host = {
            clientId: socket.handshake.query.clientId,
            socketId: socket.id
        }

        socket.join(roomCode)
        console.log(`User ${socket.handshake.query.clientId} created room ${roomCode} for game ${gameType}.`)
        socket.emit('roomCreated', roomCode)
    }

    public joinRoom(code: string, name: string, socket: CustomSocket, io: Server) {
        if (!this.codeIsValid(code)) {
            socket.emit('error', 'Invalid room code.')
            return
        } 

        if (name === '' || name.length > 10) {
            socket.emit('error', 'Invalid name.')
            return
        }

        const game = this.roomCodeToGame[code]

        if (game.players.find(player => player.name === name)) {
            socket.emit('error', 'Name is already taken.')
            return
        }

        if (game.players.length >= game.maxPlayers) {
            socket.emit('error', 'Room is full.')
            return
        }

        if (game.inProgress) {
            socket.emit('error', 'Game has already started.')
            return
        }

        this.userToRoomCode[socket.handshake.query.clientId] = code
        game.addPlayer(socket.handshake.query.clientId, name, socket.id)
        socket.join(code)
        
        console.log(`User ${socket.handshake.query.clientId} joined room ${code}.`)

        const gameType = game.gameType
        socket.emit('roomJoined', {
            gameType,
            name,
            roomCode: code,
        })
        io.to(game.host.socketId).emit('playerJoined', game.players)
    }

    public codeIsValid(code: string): boolean {
        return !!this.roomCodeToGame[code]
    }

    public On(eventName: string, socket: CustomSocket, callback: OnEventCallback) {
        socket.on(eventName, (data: any) => {
            const game = this.getRoomAndReplaceSocketID(socket.handshake.query.clientId, socket.id)
            if (!game) {
                socket.emit('error', 'You are not in this room, or this room does not exist.')
                return
            }
            callback({ game, data })
        })
    }

    public Broadcast(eventName: string, io: Server, game: Game, data?: any) {
        io.to(game.host.socketId).emit(eventName, data)
        game.addEvent(game.host.socketId, eventName, data)
        for (const player of game.players) {
            game.addEvent(player.clientId, eventName, data)
            io.to(player.socketId).emit(eventName, data)
        }
    }

    public EmitToPlayers(eventName: string, io: Server, game: Game, data?: any) {
        for (const player of game.players) {
            game.addEvent(player.clientId, eventName, data)
            io.to(player.socketId).emit(eventName, data)
        }
    }

    public EmitToID(socketId: string, eventName: string, io: Server, socket: CustomSocket, data?: any) {
        const game = this.getRoomAndReplaceSocketID(socket.handshake.query.clientId, socket.id)
        if (!game) {
            socket.emit('error', 'You are not in this room, or this room does not exist.')
            return
        }
        const player = game.players.find(player => player.socketId === socketId)
        if (player) {
            game.addEvent(player.clientId, eventName, data)
        }
        io.to(socketId).emit(eventName, data)
    }
}