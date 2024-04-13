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
    public roleApprovalCount: number = 0
    public presidentIndex: number = -1
    public lastPresident: Player = {} as Player
    public lastChancellor: Player = {} as Player
    // TODO: When players die, remove them from this list
    public livingPlayers: Player[] = []

    public startGame() {
        this.inProgress = true
        this.assignRoles()
        this.livingPlayers = this.players
    }

    public getNextPresident() {
        if (this.presidentIndex !== -1) {
            // the current president becomes the last president
            this.lastPresident = this.livingPlayers[this.presidentIndex]
        }

        // now, we have a new current president
        this.presidentIndex++
        if (this.presidentIndex >= this.livingPlayers.length) {
            this.presidentIndex = 0
        }
        return this.livingPlayers[this.presidentIndex]
    }

    public pickChancellor(chancellor: Player) {
        this.lastChancellor = chancellor
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

    public getEligibleChancellors(president: Player) {
        // cannot be the current president or the last chancellor
        let eligibleChancellors = this.livingPlayers.filter(p => p.socketId !== president.socketId && p.socketId !== this.lastChancellor.socketId)

        if (this.livingPlayers.length <= 5) {
            // if only 5 players in the game, last president is also ineligible
            eligibleChancellors = eligibleChancellors.filter(p => p.socketId !== this.lastPresident.socketId)
        }

        return eligibleChancellors
    }
}