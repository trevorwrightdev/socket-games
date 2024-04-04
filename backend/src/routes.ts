import { Router } from 'express'
import { SocketGames } from './lib/SocketGames'

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

    return router
}