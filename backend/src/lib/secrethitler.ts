import { Socket } from 'socket.io'
import Game from './Game'

export class SecretHitler extends Game {

    constructor(socket: Socket) {
        super(socket)
    }
}