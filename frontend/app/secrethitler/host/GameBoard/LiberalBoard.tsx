import React from 'react'
import GameBoardCell from './GameBoardCell'

type LiberalBoardProps = {
    liberalPolicyCount: number
}

const LiberalBoard:React.FC<LiberalBoardProps> = ({ liberalPolicyCount }) => {
    
    return (
        <div className='flex flex-col items-center'>
            <h1 className='font-bold text-blue-500 text-2xl mb-1'>LIBERAL</h1>
            <div className='flex flex-row gap-2'>
                <GameBoardCell className={`${liberalPolicyCount >= 1 ? 'bg-blue-500' : ''} border-blue-500 border-8`} />
                <GameBoardCell className={`${liberalPolicyCount >= 2 ? 'bg-blue-500' : ''} border-blue-500 border-8`} />
                <GameBoardCell className={`${liberalPolicyCount >= 3 ? 'bg-blue-500' : ''} border-blue-500 border-8`} /> 
                <GameBoardCell className={`${liberalPolicyCount >= 4 ? 'bg-blue-500' : ''} border-blue-500 border-8`} /> 
                <GameBoardCell className={`${liberalPolicyCount >= 5 ? 'bg-blue-500' : ''} border-blue-500 border-8`} /> 
                <GameBoardCell className={`${liberalPolicyCount >= 6 ? 'bg-blue-500' : ''} border-blue-500 border-8`} /> 
            </div>
        </div>
    )
}

export default LiberalBoard