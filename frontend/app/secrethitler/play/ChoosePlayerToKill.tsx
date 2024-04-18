import React from 'react'
import { PlayGameState, UpdatePlayGameState } from './usePlayGameState'
import RainbowButton from '@/app/components/RainbowButton'
import server from '@/lib/server'

type ChoosePlayerToKill = {
    playGameState: PlayGameState   
    updatePlayGameState: UpdatePlayGameState
}

const ChoosePlayerToKill:React.FC<ChoosePlayerToKill> = ({ playGameState, updatePlayGameState }) => {
    
    return (
        <div className='flex flex-col items-center gap-2'>
            <h1 className='text-red-500'>Choose a player to <span className='font-bold italic'>kill.</span></h1>
            {playGameState.playerList.map((player) => {

                const killPlayer = () => {
                    server.socket.emit('pickedKill', player)
                }

                return <RainbowButton key={player.clientId} onClick={killPlayer}>{player.name}</RainbowButton>
            })}
        </div>
    )
}

export default ChoosePlayerToKill