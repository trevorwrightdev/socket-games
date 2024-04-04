export type GameType = 'Secret Hitler'

export function isValidGame(gameName: GameType): boolean {
    return gameName === 'Secret Hitler'
}