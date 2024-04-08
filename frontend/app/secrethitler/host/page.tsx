'use client'
import MainMenu from './MainMenu'
import { useHostGameState } from './useHostGameState'
import FadeContainer from 'components/FadeContainer'
import Loading from './Loading'
import WaitingRoom from './WaitingRoom'
import Counter from './Counter'

export default function SecretHitlerHostPage() {

    const { hostGameState, updateHostGameState, fade, currentPage } = useHostGameState()

  return (
    <FadeContainer fade={fade}>
        {currentPage === 'Main Menu' && (
            <MainMenu updateGameState={updateHostGameState}/>
        )}
        {currentPage === 'How to Play' && (
            <div className='grid place-items-center w-full h-screen'>nice</div>
        )}
        {currentPage === 'Loading' && (
            <Loading />
        )}
        {currentPage === 'Waiting Room' && (
            <WaitingRoom gameState={hostGameState} updateGameState={updateHostGameState}/>
        )}
        {currentPage === 'Counter' && (
            <Counter />
        )}
    </FadeContainer>
  )
}
