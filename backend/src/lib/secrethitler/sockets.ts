import { Socket, Server } from 'socket.io'
import { SocketGames } from '../SocketGames'
import { SecretHitler, PresidentialPower } from './secrethitler'
import { CustomSocket, Player } from '../utils'
import Game from '../Game'

// socketGames.EmitToID(recipient, 'eventName', io, socket, data)
export default function SecretHitlerSockets(io: Server, socket: CustomSocket, socketGames: SocketGames) {

    socketGames.On('startGame', socket, ({ game }) => {
        if (game.players.length < game.minPlayers) {
            socketGames.EmitToID(game.host.socketId, 'error', io, socket, 'Not enough players to start the game.')
            return
        }

        const currentGame = game as SecretHitler
        currentGame.startGame()
        // emit to the host the game as begun.
        socketGames.EmitToID(game.host.socketId, 'gameStarted', io, socket)
    })

    socketGames.On('revealRoles', socket, ({ game }) => {
        const currentGame = game as SecretHitler

        const hitlerData: { role: string, otherFascists: string[] }  = { role: 'hitler', otherFascists: [] }
        if (currentGame.players.length <= 6) {
            hitlerData.otherFascists = currentGame.roles.fascists.filter(f => f.clientId !== currentGame.roles.hitler.clientId).map(f => f.name)
        }
        socketGames.EmitToID(currentGame.roles.hitler.socketId, 'role', io, socket, hitlerData)

        for (const liberal of currentGame.roles.liberals) {
            socketGames.EmitToID(liberal.socketId, 'role', io, socket, {
                role: 'liberal'
            })
        }

        for (const fascist of currentGame.roles.fascists) {
            if (fascist.clientId === currentGame.roles.hitler.clientId) continue

            const otherFascists = currentGame.roles.fascists.filter(f => f.clientId !== fascist.clientId && f.clientId !== currentGame.roles.hitler.clientId).map(f => f.name)
            socketGames.EmitToID(fascist.socketId, 'role', io, socket, {
                role: 'fascist',
                otherFascists: otherFascists,
                hitler: currentGame.roles.hitler.name
            })
        }
    })

    function beginRound(currentGame: SecretHitler, specificPresident?: Player) {
        const gameOverMessage = currentGame.getGameOverMessage()
        if (gameOverMessage) {
            socketGames.EmitToID(currentGame.host.socketId, 'gameOver', io, socket, gameOverMessage)
            return
        }

        const president = specificPresident || currentGame.getNextPresident()
        currentGame.runningPresident = president
        socketGames.EmitToID(currentGame.host.socketId, 'newPresident', io, socket, `${president.name} is the president. ${president.name}, please choose your chancellor.`)
        socketGames.EmitToID(president.socketId, 'chooseChancellor', io, socket, currentGame.getEligibleChancellors(president))
    }

    socketGames.On('approveRole', socket, ({ game }) => {
        socketGames.EmitToID(socket.id, 'success', io, socket)

        const currentGame = game as SecretHitler
        currentGame.roleApprovalCount++

        if (currentGame.roleApprovalCount === currentGame.players.length) {
            socketGames.EmitToID(currentGame.host.socketId, 'showGameBoard', io, socket)
            beginRound(currentGame)
        }
    })

    socketGames.On('pickChancellor', socket, ({ game, data }) => {
        socketGames.EmitToID(socket.id, 'success', io, socket)

        const currentGame = game as SecretHitler
        const player = data as Player
        currentGame.runningChancellor = player

        // emit to everyone a chancellor has been picked
        socketGames.Broadcast('chancellorPicked', io, socket, currentGame, {
            chancellor: player,
            president: currentGame.players[currentGame.presidentIndex]
        })
    })

    socketGames.On('vote', socket, ({ game, data }) => {
        socketGames.EmitToID(socket.id, 'success', io, socket)

        const currentGame = game as SecretHitler
        const player = currentGame.players.find(p => p.clientId === socket.handshake.query.clientId)
        socketGames.EmitToID(currentGame.host.socketId, 'vote', io, socket, { name: player?.name, vote: data })
        // TODO: Fix the issue where frontend votes are not accurate 

        if (data) {
            currentGame.yesVotes++
        } else {
            currentGame.noVotes++
        }

        if (currentGame.yesVotes + currentGame.noVotes === currentGame.players.length) {
            if (currentGame.yesVotes > currentGame.noVotes) {
                // now we have successfully elected these players
                currentGame.president = currentGame.runningPresident
                currentGame.chancellor = currentGame.runningChancellor

                // Check for hitler election if 3 fascist policies
                if (currentGame.fascistPolicyCount >= 3 && currentGame.chancellor.clientId === currentGame.roles.hitler.clientId) {
                    socketGames.EmitToID(currentGame.host.socketId, 'role', io, socket, {
                        message: `${currentGame.roles.hitler.name} was Hitler and elected chancellor while 3 fascist policies had been enacted. Fascists win!`,
                        winners: 'fascist'
                    })
                } else {
                    // emit to everyone that the vote passed
                    socketGames.EmitToID(currentGame.host.socketId, 'votePassed', io, socket, 'The vote has passed. The president and chancellor will now enact a policy.')
                    setTimeout(() => startPolicyPhase(currentGame), 5000)
                }
            } else {
                incrementFailedElectionCount(currentGame, false)
                setTimeout(() => beginRound(currentGame), 5000)
            }
            // reset votes
            currentGame.yesVotes = 0
            currentGame.noVotes = 0
        }
    })

    function incrementFailedElectionCount(game: SecretHitler, veto: boolean) {
        game.failedElectionCount++

        let electionFailed = false
        if (game.failedElectionCount >= 3) {
            const policy = game.getOnePolicyCard()
            game.enactPolicy(policy)
            // reset last chancellor and president 
            game.chancellor = {} as Player
            game.president = {} as Player

            socketGames.EmitToID(game.host.socketId, 'electionChaos', io, socket, {
                message: `The election has failed 3 times in a row. The top policy card has been enacted and each player is now eligible for election. ${policy === 'fascist' && game.fascistPolicyCount === 5 ? 'Veto power is also unlocked.' : ''}`,
                fascistPolicyCount: game.fascistPolicyCount,
                liberalPolicyCount: game.liberalPolicyCount
            })

            electionFailed = true
        } else {
            socketGames.EmitToID(game.host.socketId, 'voteFailed', io, socket, {message: veto ? 'The election tracker has been increased.' : 'The vote has failed. The next president will now nominate a chancellor.',
                failedElectionCount: game.failedElectionCount
            })
        }
    }

    function startPolicyPhase(game: Game) {
        const currentGame = game as SecretHitler

        // at this point, the president and chancellor have been elected, and they need to enact policies
        const policyOptions = currentGame.getThreePolicyCards()
        socketGames.EmitToID(currentGame.president.socketId, 'presidentPickPolicy', io, socket, policyOptions)
        socketGames.EmitToID(currentGame.host.socketId, 'presidentPickPolicy', io, socket, `President ${currentGame.president.name} is choosing a policy to discard.`)
    }

    socketGames.On('discardPolicy', socket, ({ game, data }) => {
        socketGames.EmitToID(socket.id, 'success', io, socket)

        const currentGame = game as SecretHitler

        socketGames.EmitToID(currentGame.host.socketId, 'chancellorPickPolicy', io, socket, `Chancellor ${currentGame.chancellor.name} is now choosing a policy to enact.`)
        socketGames.EmitToID(currentGame.chancellor.socketId, 'chancellorPickPolicy', io, socket, {
            policies: data,
            canVeto: currentGame.fascistPolicyCount >= 5
        })
    })

    socketGames.On('enactPolicy', socket, ({ game, data }) => {
        socketGames.EmitToID(socket.id, 'success', io, socket)

        const currentGame = game as SecretHitler

        currentGame.enactPolicy(data)
        const playerName = currentGame.players.find(p => p.clientId === socket.handshake.query.clientId)?.name
        socketGames.EmitToID(currentGame.host.socketId, 'newPolicyEnacted', io, socket, { fascistPolicyCount: currentGame.fascistPolicyCount, liberalPolicyCount: currentGame.liberalPolicyCount, playerName, newPolicy: data })

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
            socketGames.EmitToID(currentGame.host.socketId, 'message', io, socket, {
                message: `President ${currentGame.president.name} is now investigating a player's party.`,
                color: 'black'
            })
            socketGames.EmitToID(president.socketId, 'investigation', io, socket, currentGame.getPlayersToInvestigate(president))
        } else if (power === 'pick president') {
            // pick next president
            socketGames.EmitToID(currentGame.host.socketId, 'message', io, socket, {
                message: `President ${currentGame.president.name} is now choosing the next president.`,
                color: 'black'
            })
            socketGames.EmitToID(currentGame.president.socketId, 'pickNextPresident', io, socket, currentGame.getPlayersBesides(currentGame.president))
        } else if (power === 'peek') {
            // peek top 3 cards
            socketGames.EmitToID(currentGame.host.socketId, 'message', io, socket, {
                message: `President ${currentGame.president.name} is now peeking at the top 3 policy cards in the deck.`,
                color: 'black'
            })
            socketGames.EmitToID(currentGame.president.socketId, 'peek', io, socket, currentGame.peekTopThreePolicies())
        } else if (power === 'kill') {
            // kill player
            socketGames.EmitToID(currentGame.host.socketId, 'message', io, socket, {
                message: `President ${currentGame.president.name} is now choosing a player to kill!`,
                color: 'red'
            })
            socketGames.EmitToID(currentGame.president.socketId, 'kill', io, socket, currentGame.getPlayersBesides(currentGame.president))
        }
    }

    socketGames.On('finishedInvestigation', socket, ({ game, data }) => {
        socketGames.EmitToID(socket.id, 'success', io, socket)

        const currentGame = game as SecretHitler
        const playerInvestigatedName = data
        socketGames.EmitToID(currentGame.host.socketId, 'message', io, socket, {
            message: `President ${currentGame.president.name} has investigated ${playerInvestigatedName}.`,
            color: 'black'
        })

        setTimeout(() => {
            beginRound(currentGame)
        }, 5000)
    })

    socketGames.On('pickPresident', socket, ({ game, data }) => {
        socketGames.EmitToID(socket.id, 'success', io, socket)

        const newPresident = data as Player
        const currentGame = game as SecretHitler

        socketGames.EmitToID(currentGame.host.socketId, 'message', io, socket, {
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
        socketGames.EmitToID(socket.id, 'success', io, socket)

        const currentGame = game as SecretHitler
        const playerToKill = data as Player

        currentGame.killPlayer(playerToKill)
        socketGames.EmitToID(currentGame.host.socketId, 'message', io, socket, {
            message: `President ${currentGame.president.name} has killed ${playerToKill.name}!`,
            color: 'red'
        })
        socketGames.EmitToID(playerToKill.socketId, 'youDied', io, socket)

        setTimeout(() => {
            if (playerToKill.clientId === currentGame.roles.hitler.clientId) {
                socketGames.EmitToID(currentGame.host.socketId, 'gameOver', io, socket, {
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
        socketGames.EmitToID(currentGame.host.socketId, 'message', io, socket, {
            message: `Chancellor ${currentGame.chancellor.name} has requested a veto from President ${currentGame.president.name}.`,
            color: 'black'
        })
        socketGames.EmitToID(currentGame.president.socketId, 'requestVeto', io, socket)
    })

    socketGames.On('veto', socket, ({ game, data }) => {
        socketGames.EmitToID(socket.id, 'success', io, socket)

        const currentGame = game as SecretHitler
        const veto = data as boolean

        if (veto) {
            socketGames.EmitToID(currentGame.chancellor.socketId, 'vetoResult', io, socket, true)
            socketGames.EmitToID(currentGame.host.socketId, 'message', io, socket, {
                message: `President ${currentGame.president.name} has accepted the veto request from chancellor ${currentGame.chancellor.name}.`,
                color: 'green'
            })

            setTimeout(() => {
                incrementFailedElectionCount(game as SecretHitler, true)
                setTimeout(() => {
                    beginRound(game as SecretHitler)
                }, 5000)
            }, 5000)
        } else {
            socketGames.EmitToID(currentGame.chancellor.socketId, 'vetoResult', io, socket, false)
            socketGames.EmitToID(currentGame.host.socketId, 'message', io, socket, {
                message: `President ${currentGame.president.name} has denied the veto request from chancellor ${currentGame.chancellor.name}.`,
                color: 'red'
            })
        }
    })
}