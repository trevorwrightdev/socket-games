import React from 'react'
import RainbowText from 'components/RainbowText'
import CoolButton from 'components/CoolButton'
import Link from 'next/link'
import { UpdateHostGameState, HostGameState } from './useHostGameState'
import { useEffect } from 'react'
import server from '@/lib/server'

type MainMenuProps = {
    updateHostGameState: UpdateHostGameState
    hostGameState: HostGameState
}

const MainMenu:React.FC<MainMenuProps> = ({ updateHostGameState, hostGameState }) => {

    useEffect(() => {
        server.socket.on('roomCreated', (roomCode: string) => {
            updateHostGameState({ page: 'Waiting Room', roomCode })
        })

        return () => {
            server.socket.off('roomCreated')
        }
    }, [hostGameState])

    function handleStartGame() {
        server.createRoom('Secret Hitler')
    }
    
    return (
        <div className='flex flex-col items-center gap-4'>
            <RainbowText className='text-3xl font-bold'>Secret Hitler</RainbowText>
            <CoolButton onClick={handleStartGame}>Start Game</CoolButton>
            <CoolButton onClick={() => updateHostGameState({ page: 'How to Play' })}>How to Play</CoolButton>
            <Link href='/'>
                <CoolButton>Back</CoolButton>
            </Link>
        </div>
    )
}

export default MainMenu