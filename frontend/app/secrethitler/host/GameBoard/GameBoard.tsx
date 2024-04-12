import React from 'react'
import FascistBoard from './FascistBoard'
import LiberalBoard from './LiberalBoard'

type GameBoardProps = {
    
}

const GameBoard:React.FC<GameBoardProps> = () => {
    
    return (
        <div>
            <FascistBoard />
            <LiberalBoard />
        </div>
    )
}
export default GameBoard;