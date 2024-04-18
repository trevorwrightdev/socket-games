import { GameType, Player } from './utils'

export type SocketEvent = {
    event: string
    data: any
    timestamp: number
}

export type SocketEventMap = {
    [key: string]: SocketEvent,
}

export type SendEventTimestamps = {
    [key: string]: number
}

export default class Game {
    // key is socket id, value is player name
    public players: Player[] = []
    private clientIds: Set<string> = new Set()
    public roomCode: string = ''
    public gameType: GameType = 'None'
    public host: { clientId: string, socketId: string } = {clientId: '', socketId: ''} 
    public minPlayers: number = 0
    public maxPlayers: number = 20
    public inProgress: boolean = false
    public pastEmitEvents: SocketEventMap = {}
    public sendEventTimestamps: SendEventTimestamps = {}

    public addPlayer(clientId: string, name: string, socketId: string) {
        this.players.push({
            clientId,
            name,
            socketId
        })
        this.clientIds.add(clientId)
    }

    public getPlayerByClientId(clientId: string) {
        return this.players.find(p => p.clientId === clientId)
    }

    public addEvent(clientId: string, event: string, data: any) {
        this.pastEmitEvents[clientId] = { event, data, timestamp: Date.now() }
    }

    public addSendEventTimestamp(clientId: string) {
        this.sendEventTimestamps[clientId] = Date.now()
    }

    public swapSocketId(clientId: string, socketId: string) {
        const player = this.players.find(player => player.clientId === clientId)
        if (player) {
            player.socketId = socketId
            console.log(`${player.name} has new socket id: ${socketId}`)
        }
    }
}
