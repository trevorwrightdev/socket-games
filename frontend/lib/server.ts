import io from 'socket.io-client'

type GameType = 'Secret Hitler'

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

class Server {
    public socket = io(api_url)

    public createRoom(gameType: GameType) {
        this.socket.emit('createRoom', gameType)
    }

    public joinRoom(code: string) {
        this.socket.emit('joinRoom', code)
    }

    public async validateCode(code: string): Promise<[any, string | null]> {
        return await betterFetch(`${api_url}/codevalid?code=${code}`)
    }

}

const server = new Server()

export default server