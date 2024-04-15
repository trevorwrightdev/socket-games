import React from 'react'
import FascistBoard from './FascistBoard'
import LiberalBoard from './LiberalBoard'
import { HostGameState } from '../useHostGameState'
import VoteDisplay from './VoteDisplay'

type GameBoardProps = {
    hostGameState: HostGameState
}

const GameBoard:React.FC<GameBoardProps> = ({ hostGameState }) => {
    
    return (
        <div className='flex flex-col items-center'>
            <FascistBoard />
            <LiberalBoard />
            <p className='font-bold'>-------------------------------------------------------------</p>
            <p className='text-xl mb-2'>{hostGameState.message}</p>
            <VoteDisplay hostGameState={hostGameState}/>
        </div>
    )
}
export default GameBoard;