import React from 'react'
import { HostGameState } from '../useHostGameState'

type ElectionTrackerProps = {
    failedElectionCount: number
}

const ElectionTracker:React.FC<ElectionTrackerProps> = ({ failedElectionCount }) => {
    
    return (
        <div className='flex flex-col items-center'>
            <h1 className='font-bold'>ELECTION TRACKER</h1>
            <div className='flex flex-row gap-1'>
                <div className={`${failedElectionCount >= 1 ? 'bg-red-500' : ''} w-8 h-8 rounded-full border-black border-2`}/>
                <div className={`${failedElectionCount >= 2 ? 'bg-red-500' : ''} w-8 h-8 rounded-full border-black border-2`}/>
                <div className={`${failedElectionCount >= 3 ? 'bg-red-500' : ''} w-8 h-8 rounded-full border-black border-2`}/>
            </div>
        </div>
    )
}

export default ElectionTracker