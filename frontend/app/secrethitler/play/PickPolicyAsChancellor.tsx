import React, { useState, useEffect } from 'react'
import { PlayGameState, UpdatePlayGameState } from './usePlayGameState'
import server from '@/lib/server'
import RainbowButton from '@/app/components/RainbowButton'

type PickPolicyAsChancellorProps = {
    playGameState: PlayGameState
    updatePlayGameState: UpdatePlayGameState
}

const PickPolicyAsChancellor:React.FC<PickPolicyAsChancellorProps> = ({ playGameState, updatePlayGameState }) => {
    
    const [awaitingVeto, setAwaitingVeto] = useState<boolean>(false)
    const [vetoFailed, setVetoFailed] = useState<boolean>(false)

    function requestVeto() {
        setAwaitingVeto(true)
        server.socket.emit('requestVeto')
    }

    useEffect(() => {
        server.socket.on('vetoResult', (veto: boolean) => {
            if (veto === false) {
                setVetoFailed(true)
            } else {
                updatePlayGameState({ page: 'Waiting' })
            }
        })

        return () => {
            server.socket.off('vetoResult')
        }
    }, [])

    return (
        <div className='flex flex-col items-center gap-2'>
            {(!awaitingVeto || vetoFailed) && (
                <>
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
                    {(playGameState.canVeto && !vetoFailed) && (
                        <RainbowButton onClick={requestVeto}>Request Veto</RainbowButton>
                    )}
                </>
            )}
            {vetoFailed && (
                <p className='text-red-500'>Your veto was <span className='font-bold italic'>denied</span> by the president.</p>
            )}
            {(awaitingVeto && !vetoFailed) && (
                <p>You have requested a veto from the president.</p>
            )}
        </div>
    )
}

export default PickPolicyAsChancellor