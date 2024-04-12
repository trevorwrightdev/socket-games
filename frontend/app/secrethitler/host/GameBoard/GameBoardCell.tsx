import React from 'react'

type GameBoardCellProps = {
    icon?: string
    className?: string
}

const GameBoardCell:React.FC<GameBoardCellProps> = ({ icon, className }) => {
    
    return (
        <div className={`w-24 h-36 rounded-lg grid place-items-center ${className}`}>
            <p className='text-4xl'>{icon}</p>
        </div>
    )
}
export default GameBoardCell