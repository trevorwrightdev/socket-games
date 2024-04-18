import io from 'socket.io-client'
import { GameType } from './utils'

const api_url: string = process.env.NEXT_PUBLIC_API_URL as string

async function betterFetch(url: string): Promise<[any, string | null]> {
    try {
        const response = await fetch(url)
        if (!response.ok) {
            // Attempt to read the error message from the JSON response
            const errorResponse = await response.json()
            const errorMessage = errorResponse.error || 'Invalid server response'
            throw new Error(errorMessage)
        }
        const data = await response.json()
        return [data, null]
    } catch (error) {
        // Ensure we are handling an instance of Error
        const message = error instanceof Error ? error.message : 'An unknown error occurred'
        return [null, message]
    }
}

function generateClientId() {
    return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, function(c) {
        const r = (Math.random() * 16) | 0;
        return r.toString(16);
    })
}

class Server {
    public socket = io(api_url, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        query: {
            clientId: generateClientId()
        }
    })

    constructor() {
        this.socket.on('disconnect', () => {
            this.socket.connect()
        })
    }

    public resync() {
        this.socket.connect()

        this.socket.emit('resync')
    }

    public createRoom(gameType: GameType) {
        this.socket.emit('createRoom', gameType)
    }

    public joinRoom(code: string, name: string) {
        this.socket.emit('joinRoom', { code, name })
    }

    public async validateCode(code: string): Promise<[any, string | null]> {
        return await betterFetch(`${api_url}/codevalid?code=${code}`)
    }

    public async getRole(code: string, playerClientId: string): Promise<[any, string | null]> {
        return await betterFetch(`${api_url}/getrole?code=${code}&playerClientId=${playerClientId}`)
    }

}

const server = new Server()

export default server