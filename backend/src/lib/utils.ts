import { SecretHitlerGameState } from './secrethitler'

export type GameType = 'Secret Hitler'

export type Games = {
    [key: string]: SecretHitlerGameState
}