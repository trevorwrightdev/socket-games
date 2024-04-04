import { Socket } from 'socket.io'

export default class Game {
    private players: Set<string> = new Set<string>();
    private socket: Socket

    constructor(socket: Socket) {
        this.socket = socket
    }

    public addPlayer(player: string) {
        this.players.add(player);
    }
}
