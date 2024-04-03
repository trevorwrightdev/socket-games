import React from 'react'
import RainbowText from 'components/RainbowText'
import CoolButton from 'components/CoolButton'
import Link from 'next/link'
import { UpdateGameState } from '../useGameState'
import { useEffect } from 'react'
import server from '@/lib/server'

type MainMenuProps = {
    updateGameState: UpdateGameState
}

const MainMenu:React.FC<MainMenuProps> = ({ updateGameState }) => {

    useEffect(() => {
        server.socket.on('roomCreated', (roomCode: string) => {
            updateGameState({ page: 'Waiting Room', roomCode })
        })

        return () => {
            server.socket.off('roomCreated')
        }
    }, [])

    function handleStartGame() {
        server.createRoom('Secret Hitler')
    }
    
    return (
        <div className='w-full h-screen grid place-items-center'>
            <div className='flex flex-col items-center gap-4'>
                <RainbowText className='text-3xl font-bold'>Secret Hitler</RainbowText>
                <CoolButton onClick={handleStartGame}>Start Game</CoolButton>
                <CoolButton onClick={() => updateGameState({ page: 'How to Play' })}>How to Play</CoolButton>
                <Link href='/'>
                    <CoolButton>Back</CoolButton>
                </Link>
            </div>
        </div>
    )
}

export default MainMenu