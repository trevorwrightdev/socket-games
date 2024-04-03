import io from 'socket.io-client'
import { GameType } from './types'

class Server {
    public socket = io(process.env.NEXT_PUBLIC_API_URL as string)

    public createRoom(gameType: GameType) {
        this.socket.emit('createRoom', gameType)
    }
}

const server = new Server()

export default server