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
    public runningPresident: Player = {} as Player
    public runningChancellor: Player = {} as Player
    public president: Player = {} as Player
    public chancellor: Player = {} as Player
    public yesVotes: number = 0
    public noVotes: number = 0
    public policyDeck: ('fascist' | 'liberal')[] = this.shufflePolicyDeck()
    public fascistPolicyCount: number = 0
    public liberalPolicyCount: number = 0
    public failedElectionCount: number = 0

    public startGame() {
        this.inProgress = true
        this.assignRoles()
    }

    public getNextPresident() {
        // now, we have a new current president
        this.presidentIndex++
        if (this.presidentIndex >= this.players.length) {
            this.presidentIndex = 0
        }
        return this.players[this.presidentIndex]
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

    public shufflePolicyDeck() {
        const startingDeck = [
            'liberal',
            'liberal',
            'liberal',
            'liberal',
            'liberal',
            'liberal',
            'fascist',
            'fascist',
            'fascist',
            'fascist',
            'fascist',
            'fascist',
            'fascist',
            'fascist',
            'fascist',
            'fascist',
            'fascist',
        ]

        return this.shuffleArray(startingDeck)
    }

    public getThreePolicyCards() {
        // shuffle the deck if not enough cards
        if (this.policyDeck.length < 3) {
            this.policyDeck = this.shufflePolicyDeck()
        }

        return this.policyDeck.splice(0, 3)
    }
    
    public getOnePolicyCard() {
        // shuffle the deck if not enough cards
        if (this.policyDeck.length < 1) {
            this.policyDeck = this.shufflePolicyDeck()
        }

        return this.policyDeck.splice(0, 1)[0]
    }

    public getEligibleChancellors(president: Player) {
        // cannot be the current president or the last chancellor
        let eligibleChancellors = this.players.filter(p => p.socketId !== president.socketId && p.socketId !== this.chancellor.socketId)

        if (this.players.length > 5) {
            // if more than 5 players in the game, last president is ineligible
            eligibleChancellors = eligibleChancellors.filter(p => p.socketId !== this.president.socketId)
        }

        return eligibleChancellors
    }

    public getPlayersBesides(player: Player) {
        return this.players.filter(p => p.socketId !== player.socketId)
    }

    public enactPolicy(policy: 'fascist' | 'liberal') {
        if (policy === 'fascist') {
            this.fascistPolicyCount++
        } else {
            this.liberalPolicyCount++
        }
    }

    public getGameOverMessage() {
        const hitlerAlive = this.players.some(p => p.socketId === this.roles.hitler.socketId)
        if (this.liberalPolicyCount >= 6) {
            return {
                message: 'Liberals have enacted 6 policies. Liberals win!',
                winners: 'liberal'
            }
        } else if (this.fascistPolicyCount >= 6) {
            return {
                message: 'Fascists have enacted 6 policies. Facscists win!',
                winners: 'fascist'
            }
        } else if (hitlerAlive === false) {
            return {
                message: `${this.roles.hitler.name} was Hitler and has been killed. Liberals win!`,
                winners: 'liberal'
            }
        }
        return null
    }
}