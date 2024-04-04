import { GameType } from './utils'

export default class Game {
    private players: { [key: string]: string } = {}
    public gameType: GameType = 'None'

    public addPlayer(socketId: string, name: string) {
        this.players[socketId] = name
    }
}
