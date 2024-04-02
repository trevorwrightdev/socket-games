import io from 'socket.io-client'

class Server {
    public socket = io('http://localhost:3001')
}

const server = new Server()

export default server