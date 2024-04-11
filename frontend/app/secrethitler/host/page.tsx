'use client'
import MainMenu from './MainMenu'
import { useHostGameState } from './useHostGameState'
import FadeContainer from 'components/FadeContainer'
import WaitingRoom from './WaitingRoom'
import Countdown from './Countdown'

export default function SecretHitlerHostPage() {

    const { hostGameState, updateHostGameState, fade, currentPage } = useHostGameState()

  return (
    <FadeContainer fade={fade}>
        <div className='w-full h-screen grid place-items-center'>
            <div className='flex flex-col items-center'>
                {currentPage === 'Main Menu' && (
                    <MainMenu updateHostGameState={updateHostGameState} hostGameState={hostGameState}/>
                )}
                {currentPage === 'Waiting Room' && (
                    <WaitingRoom hostGameState={hostGameState} updateHostGameState={updateHostGameState}/>
                )}
                {currentPage === 'Countdown' && (
                    <Countdown hostGameState={hostGameState} updateHostGameState={updateHostGameState}/>
                )}
                <p className='text-red-500'>{hostGameState.error}</p>
            </div>
        </div>
    </FadeContainer>
  )
}
