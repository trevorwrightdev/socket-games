import React from 'react'
import FascistBoard from './FascistBoard'
import LiberalBoard from './LiberalBoard'
import { HostGameState } from '../useHostGameState'

type GameBoardProps = {
    hostGameState: HostGameState
}

const GameBoard:React.FC<GameBoardProps> = ({ hostGameState }) => {
    
    return (
        <div className='flex flex-col items-center'>
            <FascistBoard />
            <LiberalBoard />
            <p className='font-bold'>-------------------------------------------------------------</p>
            <p className='text-xl'>{hostGameState.message}</p>
        </div>
    )
}
export default GameBoard;