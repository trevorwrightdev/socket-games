import { useState } from 'react'

interface GameState {
    page: 'Main Menu'
}

const defaultGameState: GameState = { page: 'Main Menu' }

export function useGameState(): [GameState, (newState: Partial<GameState>) => void] {
    const [gameState, setGameState] = useState<GameState>(defaultGameState)

    function updateGameState(newState: Partial<GameState>) {
        setGameState({
            ...gameState,
            ...newState
        })
    }

    return [gameState, updateGameState]
}