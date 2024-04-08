'use client'
import RainbowText from '@/app/components/RainbowText'
import { usePlayGameState } from './usePlayGameState'
import RainbowButton from '@/app/components/RainbowButton'
import server from '@/lib/server'
import { useEffect } from 'react'

export default function Play() {

    const { currentPage, updatePlayGameState } = usePlayGameState()

    function handleIncrement() {
        server.socket.emit('increment')
    }

    useEffect(() => {
        server.socket.on('gameStarted', () => {
            updatePlayGameState({ page: 'Counter' })
        })

        return () => {
            server.socket.off('gameStarted')
        }   
    }, [])

    return (
        <div className='flex flex-col items-center'>
            <div className='bg-white w-full h-12 grid place-items-center'>
                <RainbowText className='text-xl font-bold'>Secret Hitler</RainbowText>
            </div>
            {currentPage === 'Counter' && (
                <RainbowButton onClick={handleIncrement}>+ 1</RainbowButton>
            )}
        </div>
    )    
}