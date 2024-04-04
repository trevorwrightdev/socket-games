import { Socket } from 'socket.io'

export default abstract class Game {
    private players: Set<string> = new Set<string>();
    protected socket: Socket

    constructor(socket: Socket) {
        this.socket = socket
        this.start()
    }

    public addPlayer(player: string) {
        this.players.add(player);
    }

    protected abstract start(): void
}
