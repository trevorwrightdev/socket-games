import { Socket } from 'socket.io'

export interface SecretHitlerGameState {
    players: string[]
}

export const getDefaultSecretHitlerGameState = (): SecretHitlerGameState => ({
    players: []
})

function secretHitler(socket: Socket, gameState: SecretHitlerGameState) {
    
}