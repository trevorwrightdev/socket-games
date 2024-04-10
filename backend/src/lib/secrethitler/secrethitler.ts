import Game from '../Game'
import { GameType } from '../utils'

export class SecretHitler extends Game {
    public gameType: GameType = 'Secret Hitler'
    public minPlayers: number = 5
    public maxPlayers: number = 10

    public startGame() {
        this.inProgress = true
    }
}