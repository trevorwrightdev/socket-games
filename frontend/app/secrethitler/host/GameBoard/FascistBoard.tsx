import React from 'react'
import GameBoardCell from './GameBoardCell'

type FascistBoardProps = {
    fascistPolicyCount: number
    playerCount: number
}

const FascistBoard:React.FC<FascistBoardProps> = ({ fascistPolicyCount, playerCount }) => {
    
    function getIcon(slotNumber: number) {
        if (slotNumber === 1) {
            if (playerCount < 7) {
                return ''
            } else if (playerCount < 9) {
                return ''
            } else {
                return '🔍'
            }
        } else if (slotNumber === 2) {
            if (playerCount < 7) {
                return ''
            } else if (playerCount < 9) {
                return '🔍'
            } else {
                return '🔍'
            }
        } else if (slotNumber === 3) {
            if (playerCount < 7) {
                return '🃏'
            } else if (playerCount < 9) {
                return '👨‍✈️'
            } else {
                return '👨‍✈️'
            }
        } else if (slotNumber === 4) {
            return '🔫'
        } else if (slotNumber === 5) {
            return '🔫'
        }
    }

    return (
        <div className='flex flex-col items-center'>
            <h1 className='font-bold text-red-500 text-2xl mb-1'>FASCIST</h1>
            <div className='flex flex-row gap-2'>
                <GameBoardCell className={`${fascistPolicyCount >= 1 ? 'bg-red-500' : ''} border-red-500 border-8`} icon={getIcon(1)} />
                <GameBoardCell className={`${fascistPolicyCount >= 2 ? 'bg-red-500' : ''} border-red-500 border-8`} icon={getIcon(2)} />
                <GameBoardCell className={`${fascistPolicyCount >= 3 ? 'bg-red-500' : ''} border-red-500 border-8`} icon={getIcon(3)} /> 
                <GameBoardCell className={`${fascistPolicyCount >= 4 ? 'bg-red-500' : ''} border-red-500 border-8 bg-red-200`} icon={getIcon(4)} /> 
                <GameBoardCell className={`${fascistPolicyCount >= 5 ? 'bg-red-500' : ''} border-red-500 border-8 bg-red-200`} icon={getIcon(5)} /> 
                <GameBoardCell className={`${fascistPolicyCount >= 6 ? 'bg-red-500' : ''} border-red-500 border-8 bg-red-200`} icon={'☠️'}/> 
            </div>
        </div>
    )
}

export default FascistBoard