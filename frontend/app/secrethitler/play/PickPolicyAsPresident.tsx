import React from 'react'
import { PlayGameState, UpdatePlayGameState } from './usePlayGameState'
import server from '@/lib/server'

type PickPolicyAsPresidentProps = {
    playGameState: PlayGameState
    updatePlayGameState: UpdatePlayGameState
}

const PickPolicyAsPresident:React.FC<PickPolicyAsPresidentProps> = ({ playGameState, updatePlayGameState }) => {
    
    return (
        <div className='flex flex-col items-center gap-2'>
            <h1>Choose a policy to <span className='font-bold italic'>discard</span> and <span className='font-bold italic'>not</span> enact.</h1>
            {playGameState.policies.map((policy, index) => {

                const handlePolicyDiscard = () => {
                    const newPolicies = playGameState.policies.filter((_, i) => i !== index)
                    server.socket.emit('discardPolicy', newPolicies)
                    updatePlayGameState({ page: 'Waiting' })
                }

                return (
                    <button className={`${policy === 'fascist' ? 'bg-red-500' : 'bg-blue-500'} rounded-md py-2 px-4 font-bold text-black`} onClick={handlePolicyDiscard}>{policy.toUpperCase()}</button>
                )
            })}
        </div>
    )
}

export default PickPolicyAsPresident