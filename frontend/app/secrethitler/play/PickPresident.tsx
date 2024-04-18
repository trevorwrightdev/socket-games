import React from 'react'
import { PlayGameState, UpdatePlayGameState } from './usePlayGameState'
import RainbowButton from '@/app/components/RainbowButton'
import server from '@/lib/server'

type PickPresidentProps = {
    playGameState: PlayGameState   
    updatePlayGameState: UpdatePlayGameState
}

const PickPresident:React.FC<PickPresidentProps> = ({ playGameState, updatePlayGameState }) => {
    
    return (
        <div className='flex flex-col items-center gap-2'>
            <h1>Choose a player to be president for the next turn.</h1>
            {playGameState.playerList.map((player) => {

                const pickPresident = () => {
                    server.socket.emit('pickPresident', player)
                    updatePlayGameState({ page: 'Waiting' })
                }

                return <RainbowButton key={player.clientId} onClick={pickPresident}>{player.name}</RainbowButton>
            })}
        </div>
    )
}

export default PickPresident