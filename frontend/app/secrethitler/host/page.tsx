'use client'
import MainMenu from './MainMenu'
import { useGameState } from '../useGameState'
import FadeContainer from 'components/FadeContainer'
import Loading from './Loading'

export default function SecretHitlerHostPage() {

    const { gameState, updateGameState, fade, currentPage } = useGameState()

  return (
    <FadeContainer fade={fade}>
        {currentPage === 'Main Menu' && (
            <MainMenu updateGameState={updateGameState}/>
        )}
        {currentPage === 'How to Play' && (
            <div className='grid place-items-center w-full h-screen'>nice</div>
        )}
        {currentPage === 'Loading' && (
            <Loading />
        )}
    </FadeContainer>
  )
}
