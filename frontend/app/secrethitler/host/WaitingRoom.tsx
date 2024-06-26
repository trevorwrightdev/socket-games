'use client'
import React, { useEffect, useState } from 'react'
import { HostGameState, UpdateHostGameState } from './useHostGameState'
import RainbowText from '@/app/components/RainbowText'
import server from '@/lib/server'
import { Player } from '@/lib/utils'
import RainbowButton from '@/app/components/RainbowButton'

type WaitingRoomProps = {
    hostGameState: HostGameState
    updateHostGameState: UpdateHostGameState
}

const WaitingRoom:React.FC<WaitingRoomProps> = ({ hostGameState, updateHostGameState }) => {

    const [loading, setLoading] = useState(false)

    function handlePlay() {
        server.socket.emit('startGame')
        setLoading(true)
    }
    
    return (
            <div className='flex flex-col items-center gap-4'>
                <h1 className='text-3xl font-bold'>Room Code: <RainbowText>{hostGameState.roomCode}</RainbowText></h1>
                <p>At least 5 players must join to begin Secret Hitler.</p>
                <div className='flex flex-col items-center'>
                    <p className='font-bold text-xl mb-2 underline'>Players</p>
                    {/* TODO: List players here */}
                    {hostGameState.players.map((player, index) => (
                        <div key={index} className='text-xl'>{player.name}</div>
                    ))}
                    <RainbowButton disabled={hostGameState.players.length < 5} loading={loading} onClick={handlePlay}>PLAY</RainbowButton>
                </div>
            </div>
    )
}

export default WaitingRoom