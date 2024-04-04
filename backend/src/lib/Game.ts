import { GameType } from './utils'

export default class Game {
    private players: Set<string> = new Set<string>();
    public gameType: GameType = 'None'

    public addPlayer(player: string) {
        this.players.add(player);
    }
}
