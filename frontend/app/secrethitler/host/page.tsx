'use client'
import io from 'socket.io-client'
import MainMenu from './MainMenu'
import { useGameState } from '../useGameState'

const socket = io('http://localhost:3001')

type Page = 'Main Menu' 

export default function SecretHitlerHostPage() {

    const [gameState, updateGameState] = useGameState()

  return (
    <main>
        {gameState.page === 'Main Menu' && (
            <MainMenu />
        )}
    </main>
  )
}
