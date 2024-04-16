import { Socket, Server } from 'socket.io'
import { SocketGames } from '../SocketGames'
import { SecretHitler } from './secrethitler'
import { Player } from '../utils'

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

    function beginRound(currentGame: SecretHitler) {
        const president = currentGame.getNextPresident()
        currentGame.runningPresident = president
        io.to(currentGame.host).emit('newPresident', `${president.name} is the president. ${president.name}, please choose your chancellor.`)
        io.to(president.socketId).emit('chooseChancellor', currentGame.getEligibleChancellors(president))
    }

    socketGames.On('beginRound', socket, ({ game }) => {
        const currentGame = game as SecretHitler
        beginRound(currentGame)
    })

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
                // emit to everyone that the vote passed
                io.to(currentGame.host).emit('votePassed', 'The vote has passed. The president and chancellor will now enact a policy.')

                // now we have successfully elected these players
                currentGame.president = currentGame.runningPresident
                currentGame.chancellor = currentGame.runningChancellor
            } else {
                currentGame.failedElectionCount++

                if (currentGame.failedElectionCount >= 3) {

                } else {
                    // emit to the host that the vote failed
                    io.to(currentGame.host).emit('voteFailed', {
                        message: 'The vote has failed. The next president will now nominate a chancellor.',
                        failedElectionCount: currentGame.failedElectionCount
                    })
                }
                
            }
            // reset votes
            currentGame.yesVotes = 0
            currentGame.noVotes = 0
        }
    })

    socketGames.On('startPolicyPhase', socket, ({ game }) => {
        const currentGame = game as SecretHitler

        // at this point, the president and chancellor have been elected, and they need to enact policies
        const policyOptions = currentGame.getThreePolicyCards()
        io.to(currentGame.president.socketId).emit('presidentPickPolicy', policyOptions)
        io.to(currentGame.host).emit('presidentPickPolicy', `President ${currentGame.president.name} is choosing a policy to discard.`)
    })

    socketGames.On('discardPolicy', socket, ({ game, data }) => {
        const currentGame = game as SecretHitler

        io.to(currentGame.host).emit('chancellorPickPolicy', `Chancellor ${currentGame.chancellor.name} is now choosing a policy to enact.`)
        io.to(currentGame.chancellor.socketId).emit('chancellorPickPolicy', data)
    })

    socketGames.On('enactPolicy', socket, ({ game, data }) => {
        const currentGame = game as SecretHitler

        currentGame.enactPolicy(data)

        io.to(currentGame.host).emit('newPolicyEnacted', { fascistPolicyCount: currentGame.fascistPolicyCount, liberalPolicyCount: currentGame.liberalPolicyCount })
        beginRound(currentGame)
    })
}