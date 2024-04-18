import { Router } from 'express'
import { SocketGames } from './lib/SocketGames'
import { SecretHitler } from './lib/secrethitler/secrethitler'

export default function routes(socketGames: SocketGames): Router {
    const router = Router()

    router.get('/codevalid', (req, res) => {
        const code = req.query.code
        if (!code) {
            res.status(400).json({ error: "Invalid code." })
            return
        }

        res.send(socketGames.codeIsValid(code as string))
    })

    router.get('/getrole', (req, res) => {
        const code = req.query.code
        const playerClientId = req.query.playerClientId
        if (!code) {
            res.status(400).json({ error: "Invalid code." })
            return
        }
        if (!playerClientId) {
            res.status(400).json({ error: "Invalid player." })
            return
        }

        const game = socketGames.roomCodeToGame[code as string] as SecretHitler

        const player = game.getPlayerByClientId(playerClientId as string)

        if (!player) {
            res.status(400).json({ error: "Invalid player." })
            return
        }

        // add to players investigated
        game.playersInvestigated.push(player)

        if (!game || game.gameType !== 'Secret Hitler') {
            res.status(400).json({ error: "Invalid game." })
            return
        }

        if (game.roles.hitler.clientId === playerClientId) {
            res.json({ role: 'fascist' })
            return
        } 

        for (const player of game.roles.fascists) {
            if (player.clientId === playerClientId) {
                res.json({ role: 'fascist' })
                return
            }
        }

        for (const player of game.roles.liberals) {
            if (player.clientId === playerClientId) {
                res.json({ role: 'liberal' })
                return
            }
        }

    })

    return router
}