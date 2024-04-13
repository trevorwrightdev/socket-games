import { useState, useEffect } from 'react'
import server from '@/lib/server'
import { Player } from '@/lib/utils'

export type Page = 'Main Menu' | 'How to Play' | 'Waiting Room' | 'Countdown' | 'Game Board'

export type UpdateHostGameState = (newState: Partial<HostGameState>) => void

export interface HostGameState {
    page: Page
    roomCode: string
    error: string
    players: Player[]
    message: string
}

const defaultGameState: HostGameState = { page: 'Main Menu', roomCode: '', error: '', players: [], message: '' }

export function useHostGameState(): { hostGameState: HostGameState; updateHostGameState: UpdateHostGameState, fade: boolean, currentPage: Page } {
    const [hostGameState, setHostGameState] = useState<HostGameState>(defaultGameState)
    const [currentPage, setCurrentPage] = useState<Page>(hostGameState.page)
    const [fade, setFade] = useState<boolean>(false)

    function updateHostGameState(newState: Partial<HostGameState>) {
        setHostGameState({
            ...hostGameState,
            ...newState
        })
    }

    useEffect(() => {
        setFade(true)
        setTimeout(() => {
            setCurrentPage(hostGameState.page)
            setFade(false)
        }, 250)
    }, [hostGameState.page])

    useEffect(() => {
        server.socket.on('error', (error: string) => {
            updateHostGameState({ error })
        })
        server.socket.on('roomCreated', (roomCode: string) => {
            updateHostGameState({ page: 'Waiting Room', roomCode })
        })
        server.socket.on('playerJoined', (players: Player[]) => {
            updateHostGameState({ players })
        })
        server.socket.on('gameStarted', () => {
            updateHostGameState({ page: 'Countdown' })
        })
        server.socket.on('showGameBoard', () => {
            updateHostGameState({ page: 'Game Board' })
        })
        server.socket.on('newPresident', (message: string) => {
            updateHostGameState({ message })
        })

        return () => {
            server.socket.off('error')
            server.socket.off('roomCreated')
            server.socket.off('playerJoined')
            server.socket.off('gameStarted')
            server.socket.off('showGameBoard')
            server.socket.off('newPresident')
        }
    }, [hostGameState])

    return {
        hostGameState,
        updateHostGameState,
        fade,
        currentPage
    }
}