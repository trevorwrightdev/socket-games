'use client'
import MainMenu from './MainMenu'
import { useHostGameState } from './useHostGameState'
import FadeContainer from 'components/FadeContainer'
import Loading from './Loading'
import WaitingRoom from './WaitingRoom'

export default function SecretHitlerHostPage() {

    const { hostGameState, updateHostGameState, fade, currentPage } = useHostGameState()

  return (
    <FadeContainer fade={fade}>
        <div className='w-full h-screen grid place-items-center'>
            <div className='flex flex-col items-center'>
                {currentPage === 'Main Menu' && (
                    <MainMenu updateHostGameState={updateHostGameState} hostGameState={hostGameState}/>
                )}
                {currentPage === 'How to Play' && (
                    <div className='grid place-items-center w-full h-screen'>nice</div>
                )}
                {currentPage === 'Loading' && (
                    <Loading />
                )}
                {currentPage === 'Waiting Room' && (
                    <WaitingRoom hostGameState={hostGameState} updateHostGameState={updateHostGameState}/>
                )}
                <p className='text-red-500'>{hostGameState.error}</p>
            </div>
        </div>
    </FadeContainer>
  )
}
