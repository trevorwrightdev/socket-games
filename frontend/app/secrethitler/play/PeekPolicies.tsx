import React from 'react'
import { PlayGameState, UpdatePlayGameState } from './usePlayGameState'
import RainbowButton from '@/app/components/RainbowButton'
import server from '@/lib/server'

type PeekPoliciesProps = {
    playGameState: PlayGameState
    updatePlayGameState: UpdatePlayGameState
}

const PeekPolicies:React.FC<PeekPoliciesProps> = ({ playGameState, updatePlayGameState }) => {
    
    function handleGotIt() {
        server.socket.emit('finishedPeeking')
        updatePlayGameState({ page: 'Waiting' })
    }

    return (
        <div className='flex flex-col items-center gap-2'>
            <h1>These are the next three policies in the deck.</h1>
            {playGameState.policies.map((policy, index) => (
                <div key={index} className={`${policy === 'fascist' ? 'bg-red-500' : 'bg-blue-500'} rounded-md py-2 px-4 font-bold text-black`}>{policy.toUpperCase()}</div>
            ))}
            <RainbowButton onClick={handleGotIt}>Got it!</RainbowButton>
        </div>
    )
}

export default PeekPolicies