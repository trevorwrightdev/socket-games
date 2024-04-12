import { Socket, Server } from 'socket.io'
import { SocketGames } from '../SocketGames'
import { SecretHitler } from './secrethitler'

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

    socketGames.On('approveRole', socket, ({ game }) => {
        const currentGame = game as SecretHitler
        currentGame.roleApprovalCount++

        if (currentGame.roleApprovalCount === currentGame.players.length) {
            io.to(currentGame.host).emit('allRolesApproved')
        }
    })
}