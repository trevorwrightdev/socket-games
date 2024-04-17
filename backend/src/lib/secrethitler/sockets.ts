import { Socket, Server } from 'socket.io'
import { SocketGames } from '../SocketGames'
import { SecretHitler, PresidentialPower } from './secrethitler'
import { Player } from '../utils'
import Game from '../Game'

export default function SecretHitlerSockets(io: Server, socket: Socket, socketGames: SocketGames) {

    socketGames.On('startGame', socket, ({ game }) => {
        if (game.players.length < game.minPlayers) {
            socket.emit('error', 'Not enough players to start the game.')
            return
        }

        const currentGame = game as SecretHitler
        currentGame.startGame()
        // emit to the host the game as begun.
        io.to(game.host).emit('gameStarted')
    })

    socketGames.On('revealRoles', socket, ({ game }) => {
        const currentGame = game as SecretHitler

        const hitlerData: { role: string, otherFascists: string[] }  = { role: 'hitler', otherFascists: [] }
        if (currentGame.players.length <= 6) {
            hitlerData.otherFascists = currentGame.roles.fascists.filter(f => f.socketId !== currentGame.roles.hitler.socketId).map(f => f.name)
        }
        io.to(currentGame.roles.hitler.socketId).emit('role', hitlerData)

        for (const liberal of currentGame.roles.liberals) {
            io.to(liberal.socketId).emit('role', {
                role: 'liberal',
            })
        }

        for (const fascist of currentGame.roles.fascists) {
            if (fascist.socketId === currentGame.roles.hitler.socketId) continue

            const otherFascists = currentGame.roles.fascists.filter(f => f.socketId !== fascist.socketId && f.socketId !== currentGame.roles.hitler.socketId).map(f => f.name)
            io.to(fascist.socketId).emit('role', {
                role: 'fascist',
                otherFascists: otherFascists,
                hitler: currentGame.roles.hitler.name
            })
        }
    })

    function beginRound(currentGame: SecretHitler, specificPresident?: Player) {
        const gameOverMessage = currentGame.getGameOverMessage()
        if (gameOverMessage) {
            io.to(currentGame.host).emit('gameOver', gameOverMessage)
            return
        }

        const president = specificPresident || currentGame.getNextPresident()
        currentGame.runningPresident = president
        io.to(currentGame.host).emit('newPresident', `${president.name} is the president. ${president.name}, please choose your chancellor.`)
        io.to(president.socketId).emit('chooseChancellor', currentGame.getEligibleChancellors(president))
    }

    socketGames.On('approveRole', socket, ({ game }) => {
        const currentGame = game as SecretHitler
        currentGame.roleApprovalCount++

        if (currentGame.roleApprovalCount === currentGame.players.length) {
            io.to(currentGame.host).emit('showGameBoard')
            beginRound(currentGame)
        }
    })

    socketGames.On('pickChancellor', socket, ({ game, data }) => {
        const currentGame = game as SecretHitler
        const player = data as Player
        currentGame.runningChancellor = player

        // emit to everyone a chancellor has been picked
        socketGames.Broadcast('chancellorPicked', io, currentGame, {
            chancellor: player,
            president: currentGame.players[currentGame.presidentIndex]
        })
    })

    socketGames.On('vote', socket, ({ game, data }) => {
        const currentGame = game as SecretHitler
        const player = currentGame.players.find(p => p.socketId === socket.id)
        io.to(currentGame.host).emit('vote', {
            name: player?.name,
            vote: data
        })

        if (data) {
            currentGame.yesVotes++
        } else {
            currentGame.noVotes++
        }

        if (currentGame.yesVotes + currentGame.noVotes === currentGame.players.length) {
            if (currentGame.yesVotes > currentGame.noVotes) {
                currentGame.failedElectionCount = 0

                // now we have successfully elected these players
                currentGame.president = currentGame.runningPresident
                currentGame.chancellor = currentGame.runningChancellor

                // Check for hitler election if 3 fascist policies
                if (currentGame.fascistPolicyCount >= 3 && currentGame.chancellor.socketId === currentGame.roles.hitler.socketId) {
                    io.to(currentGame.host).emit('gameOver', {
                        message: `${currentGame.roles.hitler.name} was Hitler and elected chancellor while 3 fascist policies had been enacted. Fascists win!`,
                        winners: 'fascist'
                    })
                } else {
                    // emit to everyone that the vote passed
                    io.to(currentGame.host).emit('votePassed', 'The vote has passed. The president and chancellor will now enact a policy.')

                    setTimeout(() => startPolicyPhase(currentGame), 5000)
                }
            } else {
                currentGame.failedElectionCount++

                if (currentGame.failedElectionCount >= 3) {
                    const policy = currentGame.getOnePolicyCard()
                    currentGame.enactPolicy(policy)
                    // reset last chancellor and president 
                    currentGame.chancellor = {} as Player
                    currentGame.president = {} as Player

                    io.to(currentGame.host).emit('electionChaos', {
                        message: 'The election has failed 3 times in a row. The top policy card has been enacted and each player is now eligible for election.',
                        fascistPolicyCount: currentGame.fascistPolicyCount,
                        liberalPolicyCount: currentGame.liberalPolicyCount
                    })

                    setTimeout(() => beginRound(currentGame), 5000)
                } else {
                    // emit to the host that the vote failed
                    io.to(currentGame.host).emit('voteFailed', {
                        message: 'The vote has failed. The next president will now nominate a chancellor.',
                        failedElectionCount: currentGame.failedElectionCount
                    })

                    setTimeout(() => beginRound(currentGame), 5000)
                }
                
            }
            // reset votes
            currentGame.yesVotes = 0
            currentGame.noVotes = 0
        }
    })

    function startPolicyPhase(game: Game) {
        const currentGame = game as SecretHitler

        // at this point, the president and chancellor have been elected, and they need to enact policies
        const policyOptions = currentGame.getThreePolicyCards()
        io.to(currentGame.president.socketId).emit('presidentPickPolicy', policyOptions)
        io.to(currentGame.host).emit('presidentPickPolicy', `President ${currentGame.president.name} is choosing a policy to discard.`)
    }

    socketGames.On('discardPolicy', socket, ({ game, data }) => {
        const currentGame = game as SecretHitler

        io.to(currentGame.host).emit('chancellorPickPolicy', `Chancellor ${currentGame.chancellor.name} is now choosing a policy to enact.`)
        io.to(currentGame.chancellor.socketId).emit('chancellorPickPolicy', {
            policies: data,
            // TODO: Change to if fascist policy count is greater than 5
            canVeto: true
        })
    })

    socketGames.On('enactPolicy', socket, ({ game, data }) => {
        const currentGame = game as SecretHitler

        currentGame.enactPolicy(data)
        const playerName = currentGame.players.find(p => p.socketId === socket.id)?.name
        io.to(currentGame.host).emit('newPolicyEnacted', { fascistPolicyCount: currentGame.fascistPolicyCount, liberalPolicyCount: currentGame.liberalPolicyCount, playerName, newPolicy: data })

        setTimeout(() => {
            const power = currentGame.getPresidentialPower()
            if (data === 'fascist' && currentGame.fascistPolicyCount < 6 && power !== 'none') {
                presidentialPower(currentGame, power)
            } else {
                beginRound(currentGame)
            }
        }, 5000)
    })

    function presidentialPower(game: Game, power: PresidentialPower) {
        const currentGame = game as SecretHitler
        const president = currentGame.president

        if (power === 'investigate') {
            // investigate role
            io.to(currentGame.host).emit('message', {
                message: `President ${currentGame.president.name} is now investigating a player's party.`,
                color: 'black'
            })
            io.to(president.socketId).emit('investigation', currentGame.getPlayersToInvestigate(president))
        } else if (power === 'pick president') {
            // pick next president
            io.to(currentGame.host).emit('message', {
                message: `President ${currentGame.president.name} is now choosing the next president.`,
                color: 'black'
            })
            io.to(currentGame.president.socketId).emit('pickNextPresident', currentGame.getPlayersBesides(currentGame.president))
        } else if (power === 'peek') {
            // peek top 3 cards
            io.to(currentGame.host).emit('message', {
                message: `President ${currentGame.president.name} is now peeking at the top 3 policy cards in the deck.`,
                color: 'black'
            })
            io.to(currentGame.president.socketId).emit('peek', currentGame.peekTopThreePolicies())
        } else if (power === 'kill') {
            // kill player
            io.to(currentGame.host).emit('message', {
                message: `President ${currentGame.president.name} is now choosing a player to kill!`,
                color: 'red'
            })
            io.to(currentGame.president.socketId).emit('kill', currentGame.getPlayersBesides(currentGame.president))
        }
    }

    socketGames.On('finishedInvestigation', socket, ({ game, data }) => {
        const currentGame = game as SecretHitler
        const playerInvestigatedName = data
        
        io.to(currentGame.host).emit('message', {
            message: `President ${currentGame.president.name} has investigated ${playerInvestigatedName}.`,
            color: 'black'
        })

        setTimeout(() => {
            beginRound(currentGame)
        }, 5000)
    })

    socketGames.On('pickPresident', socket, ({ game, data }) => {
        const newPresident = data as Player
        const currentGame = game as SecretHitler

        io.to(currentGame.host).emit('message', {
            message: `President ${currentGame.president.name} has chosen ${newPresident.name} as the next president.`,
            color: 'black'
        })

        setTimeout(() => {
            beginRound(currentGame, newPresident)
        }, 5000)
    })

    socketGames.On('finishedPeeking', socket, ({ game }) => {
        beginRound(game as SecretHitler)
    })

    socketGames.On('pickedKill', socket, ({ game, data }) => {
        const currentGame = game as SecretHitler
        const playerToKill = data as Player

        currentGame.killPlayer(playerToKill)
        io.to(currentGame.host).emit('message', {
            message: `President ${currentGame.president.name} has killed ${playerToKill.name}!`,
            color: 'red'
        })
        io.to(playerToKill.socketId).emit('youDied')

        setTimeout(() => {
            if (playerToKill.socketId === currentGame.roles.hitler.socketId) {
                io.to(currentGame.host).emit('gameOver', {
                    message: `${currentGame.roles.hitler.name} was Hitler and has been killed. Liberals win!`,
                    winners: 'liberal'
                })
            } else {
                beginRound(currentGame)
            }
        }, 5000)
    })

    socketGames.On('requestVeto', socket, ({ game }) => {
        const currentGame = game as SecretHitler
        io.to(currentGame.host).emit('message', {
            message: `Chancellor ${currentGame.chancellor.name} has requested a veto from President ${currentGame.president.name}.`,
            color: 'black'
        })
        io.to(currentGame.president.socketId).emit('requestVeto')
    })

    socketGames.On('veto', socket, ({ game, data }) => {
        const currentGame = game as SecretHitler
        const veto = data as boolean

        if (veto) {

        } else {
            io.to(currentGame.chancellor.socketId).emit('vetoResult', false)
            io.to(currentGame.host).emit('message', {
                message: `President ${currentGame.president.name} has denied the veto request from chancellor ${currentGame.chancellor.name}.`,
                color: 'red'
            })
        }
    })
}