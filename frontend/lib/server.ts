import io from 'socket.io-client'

class Server {
    public socket = io(process.env.NEXT_PUBLIC_API_URL as string)
}

const server = new Server()

export default server