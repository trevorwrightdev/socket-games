import { GameType, Player } from './utils'

export default class Game {
    // key is socket id, value is player name
    public players: Player[] = []
    private socketIds: Set<string> = new Set()
    public roomCode: string = ''
    public gameType: GameType = 'None'
    public host: string = ''
    public minPlayers: number = 0
    public maxPlayers: number = 20
    public inProgress: boolean = false

    public addPlayer(socketId: string, name: string) {
        this.players.push({
            socketId,
            name
        })
        this.socketIds.add(socketId)
    }

    public getPlayerBySocketId(socketId: string) {
        return this.players.find(p => p.socketId === socketId)
    }
}
