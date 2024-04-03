import React from 'react'
import { GameState, UpdateGameState } from '../useGameState'
import RainbowText from '@/app/components/RainbowText'

type WaitingRoomProps = {
    gameState: GameState
    updateGameState: UpdateGameState
}

const WaitingRoom:React.FC<WaitingRoomProps> = ({ gameState, updateGameState }) => {
    
    return (
        <div className='w-full h-screen grid place-items-center'>
            <div className='grid place-items-center gap-4'>
                <h1 className='text-3xl font-bold'>Room Code: <RainbowText>{gameState.roomCode}</RainbowText></h1>
                <div className='flex flex-col items-center'>
                    
                </div>
            </div>
        </div>
    )
}

export default WaitingRoom