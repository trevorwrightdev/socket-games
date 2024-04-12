import { useState, useEffect } from 'react'
import server from '@/lib/server'

export type Page = 'Waiting' | 'ApproveRole'

export type UpdatePlayGameState = (newState: Partial<PlayGameState>) => void

export interface PlayGameState {
    page: Page
    error: string
    roleData?: any
}

const defaultGameState: PlayGameState = { page: 'Waiting', error: '' }

export function usePlayGameState(): { playGameState: PlayGameState; updatePlayGameState: UpdatePlayGameState, fade: boolean, currentPage: Page } {
    const [playGameState, setPlayGameState] = useState<PlayGameState>(defaultGameState)
    const [currentPage, setCurrentPage] = useState<Page>(playGameState.page)
    const [fade, setFade] = useState<boolean>(false)

    function updatePlayGameState(newState: Partial<PlayGameState>) {
        setPlayGameState({
            ...playGameState,
            ...newState,
        })
    }

    useEffect(() => {
        setFade(true)
        setTimeout(() => {
            setCurrentPage(playGameState.page)
            setFade(false)
        }, 250)
        console.log(playGameState.page)
    }, [playGameState.page])

    useEffect(() => {
        server.socket.on('error', (error: string) => {
            updatePlayGameState({ error })
        })
        server.socket.on('role', (roleData: any) => {
            updatePlayGameState({ page: 'ApproveRole', roleData })
        })

        return () => {
            server.socket.off('error')
            server.socket.off('role')
        }
    }, [playGameState])

    return {
        playGameState,
        updatePlayGameState,
        fade,
        currentPage,
    }
}
