import { Socket } from 'socket.io'

export default class Game {
    private players: Set<string> = new Set<string>();

    public addPlayer(player: string) {
        this.players.add(player);
    }
}
