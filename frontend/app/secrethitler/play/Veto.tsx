import React from 'react'
import server from '@/lib/server'
import { UpdatePlayGameState } from './usePlayGameState'

type VetoProps = {
    updatePlayGameState: UpdatePlayGameState
}

const Veto:React.FC<VetoProps> = ({ updatePlayGameState }) => {
    
    function veto() {
        server.socket.emit('veto', true)
        updatePlayGameState({ page: 'Waiting' })
    }

    function noVeto() {
        server.socket.emit('veto', false)
        updatePlayGameState({ page: 'Waiting' })
    }

    return (
        <div className='flex flex-col items-center'>
            <h1>Would you like to veto the current policies?</h1>
            <button className='rounded-md py-2 px-4 font-bold text-black bg-blue-500' onClick={veto}>YES</button>
            <button className='rounded-md py-2 px-4 font-bold text-black bg-red-500' onClick={noVeto}>NO</button>
        </div>
    )
}

export default Veto