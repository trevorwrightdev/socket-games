import React from 'react'
import { PlayGameState, UpdatePlayGameState } from './usePlayGameState'
import server from '@/lib/server'

type VoteProps = {
    playGameState: PlayGameState
    updatePlayGameState: UpdatePlayGameState
}

const Vote:React.FC<VoteProps> = ({ playGameState, updatePlayGameState }) => {
    
    function handleVote(vote: boolean) {
        server.socket.emit('vote', vote)
        updatePlayGameState({ page: 'Waiting' })
    }

    return (
        <div className='flex flex-col items-center'>
            <h1>Should these players be elected?</h1>
            <p>President: {playGameState.president.name}</p>
            <p>Chancellor: {playGameState.chancellor.name}</p>
            <div className='flex flex-col items-center gap-2'>
                <button className='rounded-md py-2 px-4 bg-blue-500 font-bold text-black' onClick={() => handleVote(true)}>Ja!</button>
                <button className='rounded-md py-2 px-4 bg-red-500 font-bold text-black' onClick={() => handleVote(false)}>Nein!</button>
            </div>
            
        </div>
    )
}

export default Vote