import { GameType } from './utils'

export default class Game {
    private players: { [key: string]: string } = {}
    public gameType: GameType = 'None'

    public addPlayer(socketId: string, name: string) {
        // already in game
        if (this.players[socketId]) return

        this.players[socketId] = name
    }
}
