import React from 'react'
import FascistBoard from './FascistBoard'
import LiberalBoard from './LiberalBoard'
import { HostGameState } from '../useHostGameState'
import VoteDisplay from './VoteDisplay'
import ElectionTracker from './ElectionTracker'

type GameBoardProps = {
    hostGameState: HostGameState
    liberalPolicyCount: number
    fascistPolicyCount: number
    failedElectionCount: number
}

const GameBoard:React.FC<GameBoardProps> = ({ hostGameState, liberalPolicyCount, fascistPolicyCount, failedElectionCount }) => {
    
    const getMessageColorClass = (color: string) => {
        switch(color) {
            case 'black':
                return 'text-black'; // Default text color in Tailwind
            case 'red':
                return 'text-red-500'; // Red text color
            case 'green':
                return 'text-green-500'; // Green text color
            case 'blue':
                return 'text-blue-500'
            default:
                return 'text-black'; // Fallback color
        }
    }

    return (
        <div className='flex flex-col items-center'>
            <FascistBoard fascistPolicyCount={fascistPolicyCount}/>
            <LiberalBoard liberalPolicyCount={liberalPolicyCount}/>
            <ElectionTracker failedElectionCount={failedElectionCount}/>
            <p className='font-bold'>-------------------------------------------------------------</p>
            <p className={`text-xl mb-2 text-center ${getMessageColorClass(hostGameState.messageColor)}`}>{hostGameState.message}</p>
            <VoteDisplay hostGameState={hostGameState}/>
        </div>
    )
}
export default GameBoard;