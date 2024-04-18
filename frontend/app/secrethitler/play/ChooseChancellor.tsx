import React from 'react'
import { PlayGameState, UpdatePlayGameState } from './usePlayGameState'
import RainbowButton from '@/app/components/RainbowButton'
import server from '@/lib/server'

type ChooseChancellorProps = {
    playGameState: PlayGameState   
    updatePlayGameState: UpdatePlayGameState
}

const ChooseChancellor:React.FC<ChooseChancellorProps> = ({ playGameState, updatePlayGameState }) => {
    
    return (
        <div className='flex flex-col items-center gap-2'>
            <h1>Choose a chancellor.</h1>
            {playGameState.playerList.map((player) => {

                const pickChancellor = () => {
                    server.socket.emit('pickChancellor', player)
                    updatePlayGameState({ page: 'Waiting' })
                }

                return <RainbowButton key={player.clientId} onClick={pickChancellor}>{player.name}</RainbowButton>
            })}
        </div>
    )
}

export default ChooseChancellor