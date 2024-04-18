export type GameType = 'None' | 'Secret Hitler'
import { Socket } from 'socket.io/dist/socket'

export type Player = {
    clientId: string
    socketId: string
    name: string
}

export function isValidGame(gameName: GameType): boolean {
    return gameName === 'Secret Hitler'
}

// Define a custom interface for the handshake that includes clientId
interface CustomHandshake {
    clientId: string;  // Assuring clientId is always a string
}

// Extend the default Socket interface to include your custom handshake
export interface CustomSocket extends Socket {
    handshake: Socket["handshake"] & {
        query: CustomHandshake;
    }
}