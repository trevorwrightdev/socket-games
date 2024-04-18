import { GameType, Player } from './utils'

export type SocketEvent = {
    event: string
    data: any
    timestamp: number
}

export type SocketEventMap = {
    [key: string]: SocketEvent,
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
    public pastSocketEvents: SocketEventMap = {}

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
        this.pastSocketEvents[clientId] = { event, data, timestamp: Date.now() }
    }
}
