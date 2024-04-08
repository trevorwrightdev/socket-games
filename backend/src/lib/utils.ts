export type GameType = 'None' | 'Secret Hitler'

export type Player = {
    socketId: string
    name: string
}

export function isValidGame(gameName: GameType): boolean {
    return gameName === 'Secret Hitler'
}