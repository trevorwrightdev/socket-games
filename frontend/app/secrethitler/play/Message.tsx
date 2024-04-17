import React from 'react'
import { PlayGameState } from './usePlayGameState'

type MessageProps = {
    playGameState: PlayGameState
}

const Message:React.FC<MessageProps> = ({ playGameState }) => {
    
    return (
        <div className='px-2'>
            {playGameState.message === 'dead' && (
                <p className='text-red-500 text-center'>You are <span className='font-bold italic'>dead.</span> You may not speak for the remainder of the game.</p>
            )}
            {playGameState.message === 'loss' && (
                <p className='text-red-500 text-center'>You lost!</p>
            )}
            {playGameState.message === 'win' && (
                <p className='text-green-500 text-center'>You won!</p>
            )}
        </div>
    )
}

export default Message