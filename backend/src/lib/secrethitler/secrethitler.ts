import Game from '../Game'
import { GameType, Player } from '../utils'

export interface Roles {
    hitler: Player
    liberals: Player[]
    fascists: Player[]
}

export type PresidentialPower = 'investigate' | 'peek' | 'pick president' | 'kill' | 'none'

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
    public policyDeck: ('fascist' | 'liberal')[] = []
    public fascistPolicyCount: number = 0
    public liberalPolicyCount: number = 0
    public failedElectionCount: number = 0
    public playersInvestigated: Player[] = []
    public initialPlayerCount: number = 0

    public startGame() {
        this.inProgress = true
        this.assignRoles()
        this.shufflePolicyDeck()
        this.initialPlayerCount = this.players.length
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
        const arrayCopy = [...array]
        for (let i = arrayCopy.length - 1; i > 0; i--) {
            // Generate a random index from 0 to i
            const j = Math.floor(Math.random() * (i + 1));
            // Swap elements at indices i and j
            [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
        }
        return arrayCopy;
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

        this.policyDeck = this.shuffleArray(startingDeck)
    }

    public getThreePolicyCards() {
        return this.policyDeck.splice(0, 3)
    }
    
    public getOnePolicyCard() {
        return this.policyDeck.splice(0, 1)[0]
    }

    public peekTopThreePolicies() {
        return this.policyDeck.slice(0, 3)
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

    public getPlayersToInvestigate(player: Player): Player[] {
        const playersToInvestigate = this.players.filter(p => 
            p.socketId !== player.socketId && 
            !this.playersInvestigated.some(investigatedPlayer => investigatedPlayer.socketId === p.socketId)
        )

        return playersToInvestigate
    }

    public getPlayersBesides(player: Player): Player[] {
        return this.players.filter(p => p.socketId !== player.socketId)
    }

    public enactPolicy(policy: 'fascist' | 'liberal') {
        if (policy === 'fascist') {
            this.fascistPolicyCount++
        } else {
            this.liberalPolicyCount++
        }

        // reshuffle the deck if there are less than 3 cards left
        if (this.policyDeck.length < 3) {
            this.shufflePolicyDeck()
        }
    }

    public getGameOverMessage() {
        const hitlerAlive = this.players.some(p => p.socketId === this.roles.hitler.socketId)
        if (this.liberalPolicyCount >= 5) {
            return {
                message: 'Liberals have enacted 5 policies. Liberals win!',
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

    public getPresidentialPower(): PresidentialPower {
        if (this.fascistPolicyCount === 1) {
            if (this.initialPlayerCount < 7) {
                return 'none'
            } else if (this.initialPlayerCount < 9) {
                return 'none'
            } else {
                return 'investigate'
            }
        } else if (this.fascistPolicyCount === 2) {
            if (this.initialPlayerCount < 7) {
                return 'none'
            } else if (this.initialPlayerCount < 9) {
                return 'investigate'
            } else {
                return 'investigate'
            }
        } else if (this.fascistPolicyCount === 3) {
            if (this.initialPlayerCount < 7) {
                return 'peek'
            } else if (this.initialPlayerCount < 9) {
                return 'pick president'
            } else {
                return 'pick president'
            }
        } else if (this.fascistPolicyCount === 4) {
            return 'kill'
        } else if (this.fascistPolicyCount === 5) {
            return 'kill'
        }

        return 'none'
    }
}