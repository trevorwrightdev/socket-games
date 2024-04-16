import { useState, useEffect } from 'react'
import server from '@/lib/server'
import { Player } from '@/lib/utils'

export type Page = 'Waiting' | 'ApproveRole' | 'Choose Chancellor' | 'Vote' | 'Pick Policy as President'

export type UpdatePlayGameState = (newState: Partial<PlayGameState>) => void

export interface PlayGameState {
    page: Page
    error: string
    roleData?: any
    playerList: Player[]
    president: Player
    chancellor: Player
    policies: ('fascist' | 'liberal')[]
}

const defaultGameState: PlayGameState = { page: 'Waiting', error: '', playerList: [], president: {} as Player, chancellor: {} as Player, policies: [] }

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
    }, [playGameState.page])

    useEffect(() => {
        server.socket.on('error', (error: string) => {
            updatePlayGameState({ error })
        })
        server.socket.on('role', (roleData: any) => {
            updatePlayGameState({ page: 'ApproveRole', roleData })
        })
        server.socket.on('chooseChancellor', (eligibleChancellors: Player[]) => {
            updatePlayGameState({ page: 'Choose Chancellor', playerList: eligibleChancellors })
        })
        server.socket.on('chancellorPicked', ({ chancellor, president }: { chancellor: Player, president: Player }) => {
            updatePlayGameState({ page: 'Vote', president, chancellor})
        })
        server.socket.on('pickPolicy', (policies: ('fascist' | 'liberal')[]) => {
            updatePlayGameState({ page: 'Pick Policy as President', policies })
        })

        return () => {
            server.socket.off('error')
            server.socket.off('role')
            server.socket.off('chooseChancellor')
            server.socket.off('chancellorPicked')
            server.socket.off('pickPolicy')
        }
    }, [playGameState])

    return {
        playGameState,
        updatePlayGameState,
        fade,
        currentPage,
    }
}
