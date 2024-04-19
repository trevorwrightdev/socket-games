import React from 'react'
import { HostGameState, Vote } from '../useHostGameState'

type VoteDisplayProps = {
    votes: Vote[]
    hostGameState: HostGameState
}

const VoteDisplay:React.FC<VoteDisplayProps> = ({ votes, hostGameState }) => {

    return (
        <div className='grid grid-cols-2 gap-x-8 h-24 auto-rows-max'>
            {hostGameState.showVoteBoard && votes.map((vote, index) => (
                <p key={index} className={vote.vote ? 'text-blue-500' : 'text-red-500'}><span className='font-bold'>{vote.name}</span> voted {vote.vote ? 'YES' : 'NO'}</p>
            ))}
        </div>
    )
}

export default VoteDisplay