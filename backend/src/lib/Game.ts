import { GameType, Player } from './utils'

export default class Game {
    // key is socket id, value is player name
    private players: Player[] = []
    public gameType: GameType = 'None'
    public host: string = ''

    public addPlayer(socketId: string, name: string) {
        this.players.push({
            socketId,
            name
        })
    }

    public getPlayers() {
        return this.players
    }
}
