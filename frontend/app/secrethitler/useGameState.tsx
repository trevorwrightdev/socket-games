import { useState, useEffect } from 'react'

export type Page = 'Main Menu' | 'How to Play' | 'Loading'
export type UpdateGameState = (newState: Partial<GameState>) => void

interface GameState {
    page: Page
}

const defaultGameState: GameState = { page: 'Main Menu' }

export function useGameState(): { gameState: GameState; updateGameState: UpdateGameState, fade: boolean, currentPage: Page } {
    const [gameState, setGameState] = useState<GameState>(defaultGameState)
    const [currentPage, setCurrentPage] = useState<Page>(gameState.page)
    const [fade, setFade] = useState<boolean>(false)

    function updateGameState(newState: Partial<GameState>) {
        setGameState({
            ...gameState,
            ...newState
        })
    }

    useEffect(() => {
        setFade(true)
        setTimeout(() => {
            setCurrentPage(gameState.page)
            setFade(false)
        }, 250)
    }, [gameState.page])

    return {
        gameState,
        updateGameState,
        fade,
        currentPage
    }
}