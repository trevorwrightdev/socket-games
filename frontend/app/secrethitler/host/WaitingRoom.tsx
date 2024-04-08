'use client'
import React, { useEffect, useState } from 'react'
import { HostGameState, UpdateHostGameState } from './useHostGameState'
import RainbowText from '@/app/components/RainbowText'
import server from '@/lib/server'
import { Player } from '@/lib/utils'
import RainbowButton from '@/app/components/RainbowButton'

type WaitingRoomProps = {
    gameState: HostGameState
    updateGameState: UpdateHostGameState
}

const WaitingRoom:React.FC<WaitingRoomProps> = ({ gameState, updateGameState }) => {

    const [players, setPlayers] = useState<Player[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        // Sets the players state when a player joins
        server.socket.on('playerJoined', (players: Player[]) => {
            setPlayers(players)
        })
        server.socket.on('gameStarted', () => {
            updateGameState({ page: 'Counter' })
        })

        return () => {
            server.socket.off('playerJoined')
            server.socket.off('gameStarted')
        }
    }, [])

    function handlePlay() {
        server.socket.emit('startGame')
        setLoading(true)
    }
    
    return (
        <div className='w-full h-screen grid place-items-center'>
            <div className='grid place-items-center gap-4'>
                <h1 className='text-3xl font-bold'>Room Code: <RainbowText>{gameState.roomCode}</RainbowText></h1>
                <div className='flex flex-col items-center'>
                    <p className='font-bold text-xl mb-2 underline'>Players</p>
                    {/* TODO: List players here */}
                    {players.map((player, index) => (
                        <div key={index} className='text-xl'>{player.name}</div>
                    ))}
                    <RainbowButton disabled={players.length === 0} loading={loading} onClick={handlePlay}>PLAY</RainbowButton>
                </div>
            </div>
        </div>
    )
}

export default WaitingRoom