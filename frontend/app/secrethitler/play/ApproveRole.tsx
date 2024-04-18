import React, { useEffect } from 'react'
import server from '@/lib/server'
import RainbowButton from '@/app/components/RainbowButton'
import { UpdatePlayGameState } from './usePlayGameState'

type ApproveRoleProps = {
    roleData: any
    updatePlayGameState: UpdatePlayGameState
}

const ApproveRole:React.FC<ApproveRoleProps> = ({ roleData, updatePlayGameState }) => {

    function handleApproval() {
        server.socket.emit('approveRole')
    }
    
    return (
        <div className='flex flex-col items-center'>
            {roleData.role === 'hitler' && (
                <p>😈 You are HITLER. 😈</p>
            )}
            {(!roleData.otherFascists || roleData.otherFascists.length === 0) && roleData.role === 'hitler' && (
                <p className='text-center'>You do not know who your fellow fascists are, but they know that you are Hitler.</p>
            )}
            {roleData.role === 'fascist' && (
                <p>🔪 You are a FASCIST. 🔪</p>
            )}
            {roleData.role === 'liberal' && (
                <p>😊 You are a LIBERAL. 😊</p>
            )}
            {roleData.hitler && (
                <p>{roleData.hitler} is HITLER.</p>
            )}
            {roleData.otherFascists && roleData.otherFascists.length === 1 && (
                <p>The other fascist is {roleData.otherFascists[0]}.</p>
            )}
            {roleData.otherFascists && roleData.otherFascists.length > 1 && (
                <p>The other fascists are {`${roleData.otherFascists[0]} and ${roleData.otherFascists[1]}.`}</p>
            )}
            <RainbowButton onClick={handleApproval}>Got it!</RainbowButton>
        </div>
    )
}

export default ApproveRole