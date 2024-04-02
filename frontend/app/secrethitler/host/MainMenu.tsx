import React from 'react'
import RainbowText from 'components/RainbowText'
import CoolButton from 'components/CoolButton'
import Link from 'next/link'
import { UpdateGameState } from '../useGameState'

type MainMenuProps = {
    updateGameState: UpdateGameState
}

const MainMenu:React.FC<MainMenuProps> = ({ updateGameState }) => {
    
    return (
        <div className='w-full h-screen grid place-items-center'>
            <div className='flex flex-col items-center gap-4'>
                <RainbowText className='text-3xl font-bold' text='Secret Hitler'/>
                <CoolButton>Start Game</CoolButton>
                <CoolButton onClick={() => updateGameState({ page: 'How to Play' })}>How to Play</CoolButton>
                <Link href='/'>
                    <CoolButton>Back</CoolButton>
                </Link>
            </div>
        </div>
    )
}

export default MainMenu