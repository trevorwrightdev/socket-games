import Game from '../Game'
import { GameType, Player } from '../utils'

export interface Roles {
    hitler: Player
    liberals: Player[]
    fascists: Player[]
}

export class SecretHitler extends Game {
    public gameType: GameType = 'Secret Hitler'
    public minPlayers: number = 5
    public maxPlayers: number = 10
    public roles: Roles = {
        'hitler': {} as Player,
        'liberals': [],
        'fascists': []
    }

    public startGame() {
        this.inProgress = true
        this.assignRoles()
    }

    public assignRoles() {
        let fascistCount = 2
        if (this.players.length === 5 || this.players.length === 6) {
            fascistCount = 2
        } else if (this.players.length === 7 || this.players.length === 8) {
            fascistCount = 3
        } else {
            fascistCount = 4
        }

        // shuffle players array 
        const shuffledPlayers = this.shuffleArray(this.players)
        
        let fascistIndex = 0
        for (const player of shuffledPlayers) {
            if (fascistIndex < fascistCount) {
                this.roles.fascists.push(player)

                if (fascistIndex === 0) {
                    this.roles.hitler = player
                }

                fascistIndex++
            } else {
                this.roles.liberals.push(player)
            }
        }
    }

    public shuffleArray(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            // Generate a random index from 0 to i
            const j = Math.floor(Math.random() * (i + 1));
            // Swap elements at indices i and j
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}