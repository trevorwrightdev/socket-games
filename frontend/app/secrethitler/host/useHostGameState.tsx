import { useState, useEffect } from 'react'
import server from '@/lib/server'

export type Page = 'Main Menu' | 'How to Play' | 'Loading' | 'Waiting Room' | 'Counter'

export type UpdateHostGameState = (newState: Partial<HostGameState>) => void

export interface HostGameState {
    page: Page
    roomCode: string
    error: string
}

const defaultGameState: HostGameState = { page: 'Main Menu', roomCode: '', error: '' }

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

        return () => {
            server.socket.off('error')
        }
    }, [hostGameState])

    return {
        hostGameState,
        updateHostGameState,
        fade,
        currentPage
    }
}