import React from 'react'
import { PlayGameState, UpdatePlayGameState } from './usePlayGameState'
import server from '@/lib/server'

type PickPolicyAsChancellorProps = {
    playGameState: PlayGameState
    updatePlayGameState: UpdatePlayGameState
}

const PickPolicyAsChancellor:React.FC<PickPolicyAsChancellorProps> = ({ playGameState, updatePlayGameState }) => {
    
    return (
        <div className='flex flex-col items-center gap-2'>
            <h1>Choose a policy to enact.</h1>
            {playGameState.policies.map((policy, index) => {

                const handlePolicyDiscard = () => {
                    server.socket.emit('enactPolicy', policy)
                    updatePlayGameState({ page: 'Waiting' })
                }

                return (
                    <button key={index} className={`${policy === 'fascist' ? 'bg-red-500' : 'bg-blue-500'} rounded-md py-2 px-4 font-bold text-black`} onClick={handlePolicyDiscard}>{policy.toUpperCase()}</button>
                )
            })}
        </div>
    )
}

export default PickPolicyAsChancellor