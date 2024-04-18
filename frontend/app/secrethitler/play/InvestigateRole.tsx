import React, { useState } from 'react'
import { PlayGameState, UpdatePlayGameState } from './usePlayGameState'
import RainbowButton from '@/app/components/RainbowButton'
import server from '@/lib/server'
import { useGlobalState } from '@/app/components/GlobalContextProvider'

type InvestigateRoleProps = {
    playGameState: PlayGameState   
    updatePlayGameState: UpdatePlayGameState
}

const InvestigateRole:React.FC<InvestigateRoleProps> = ({ playGameState, updatePlayGameState }) => {
    
    const [roleData, setRoleData] = useState<{ name: string, role: string } | null>(null)

    const [globalState] = useGlobalState()

    function handleGotIt() {
        server.socket.emit('finishedInvestigation', roleData!.name)
        updatePlayGameState({ page: 'Waiting' })
    }

    return (
        <div className='flex flex-col items-center gap-2'>
            {!roleData && <h1>Choose a player to investigate.</h1>}
            {!roleData && playGameState.playerList.map((player) => {

                const investigatePlayer = async () => { 
                    const [role, error] = await server.getRole(globalState.roomCode, player.clientId)
                    if (error) return console.error(error)
                    setRoleData({
                        name: player.name,
                        role: role.role
                    })
                }

                return <RainbowButton key={player.clientId} onClick={investigatePlayer}>{player.name}</RainbowButton>
            })}
            {roleData && (
                <>
                    <p className={`${roleData.role === 'fascist' ? 'text-red-500' : 'text-blue-500'}`}>
                        {roleData.name} is a {roleData.role.toUpperCase()}.
                    </p>
                    <RainbowButton onClick={handleGotIt}>Got it!</RainbowButton>
                </>
                
            )}
        </div>
    )
}

export default InvestigateRole