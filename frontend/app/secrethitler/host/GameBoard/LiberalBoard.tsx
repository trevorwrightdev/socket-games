import React from 'react'
import GameBoardCell from './GameBoardCell'

type LiberalBoardProps = {
    
}

const LiberalBoard:React.FC<LiberalBoardProps> = () => {
    
    return (
        <div className='flex flex-col items-center'>
            <h1 className='font-bold text-blue-500 text-2xl mb-1'>LIBERAL</h1>
            <div className='flex flex-row gap-2'>
                <GameBoardCell className='border-blue-500 border-8' />
                <GameBoardCell className='border-blue-500 border-8' />
                <GameBoardCell className='border-blue-500 border-8' /> 
                <GameBoardCell className='border-blue-500 border-8' /> 
                <GameBoardCell className='border-blue-500 border-8' /> 
                <GameBoardCell className='border-blue-500 border-8' /> 
            </div>
        </div>
    )
}

export default LiberalBoard