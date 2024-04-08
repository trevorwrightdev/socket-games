import Game from '../Game'
import { GameType } from '../utils'

export class SecretHitler extends Game {
    public gameType: GameType = 'Secret Hitler'
    public minPlayers: number = 5
    public maxPlayers: number = 10
    private count: number = 0

    public startGame() {
        this.inProgress = true
    }

    public increment() {
        this.count++
    }

    public getCount() {
        return this.count
    }
}