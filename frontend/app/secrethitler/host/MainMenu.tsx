import React from 'react'
import RainbowText from 'components/RainbowText'
import CoolButton from 'components/CoolButton'
import Link from 'next/link'
import { UpdateHostGameState, HostGameState } from './useHostGameState'
import { useEffect, useState } from 'react'
import server from '@/lib/server'

type MainMenuProps = {
    updateHostGameState: UpdateHostGameState
    hostGameState: HostGameState
}

const MainMenu:React.FC<MainMenuProps> = ({ updateHostGameState, hostGameState }) => {

    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false)

    useEffect(() => {
        server.socket.on('roomCreated', (roomCode: string) => {
            updateHostGameState({ page: 'Waiting Room', roomCode })
        })

        return () => {
            server.socket.off('roomCreated')
        }
    }, [hostGameState])

    function handleStartGame() {
        // this is to prevent spam requests to come in
        server.createRoom('Secret Hitler')
        setButtonDisabled(true)

        setTimeout(() => {
            setButtonDisabled(false)
        }, 5000)
    }
    
    return (
        <div className='flex flex-col items-center gap-4'>
            <RainbowText className='text-3xl font-bold'>Secret Hitler</RainbowText>
            <CoolButton onClick={handleStartGame} className={buttonDisabled ? 'pointer-events-none' : ''}>Start Game</CoolButton>
            <a href="https://www.secrethitler.com/assets/Secret_Hitler_Rules.pdf" target="_blank" rel="noopener noreferrer">
                <CoolButton>How to Play</CoolButton>
            </a>
            <Link href='/'>
                <CoolButton>Back</CoolButton>
            </Link>
        </div>
    )
}

export default MainMenu