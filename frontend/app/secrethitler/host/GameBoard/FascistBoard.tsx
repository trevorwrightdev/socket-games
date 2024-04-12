import React from 'react'
import GameBoardCell from './GameBoardCell'

type FascistBoardProps = {
    
}

const FascistBoard:React.FC<FascistBoardProps> = () => {
    
    return (
        <div className='flex flex-col items-center'>
            <h1 className='font-bold text-red-500 text-2xl mb-1'>FASCIST</h1>
            <div className='flex flex-row gap-2'>
                <GameBoardCell className='border-red-500 border-8' icon={'🔍'} />
                <GameBoardCell className='border-red-500 border-8' icon={'🔍'} />
                <GameBoardCell className='border-red-500 border-8' icon={'👨‍✈️'} /> 
                <GameBoardCell className='border-red-500 border-8 bg-red-200' icon={'🔫'} /> 
                <GameBoardCell className='border-red-500 border-8 bg-red-200' icon={'🔫'} /> 
                <GameBoardCell className='border-red-500 border-8 bg-red-200' icon={'☠️'}/> 
            </div>
        </div>
    )
}

export default FascistBoard