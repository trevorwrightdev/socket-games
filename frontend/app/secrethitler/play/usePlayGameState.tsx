import { useState, useEffect } from 'react'
import server from '@/lib/server'
import { Player } from '@/lib/utils'

export type Page = 'Waiting' | 'ApproveRole' | 'Choose Chancellor' | 'Vote' | 'Pick Policy as President' | 'Pick Policy as Chancellor' | 'Investigate' | 'Pick Next President' | 'Peek' | 'Kill Player' | 'Message' | 'Veto'

export type UpdatePlayGameState = (newState: Partial<PlayGameState>) => void

export interface PlayGameState {
    page: Page
    error: string
    roleData?: any
    playerList: Player[]
    president: Player
    chancellor: Player
    policies: ('fascist' | 'liberal')[]
    message: 'none' | 'dead' | 'loss' | 'win'
    canVeto: boolean
}

const defaultGameState: PlayGameState = { page: 'Waiting', error: '', playerList: [], president: {} as Player, chancellor: {} as Player, policies: [], message: 'none', canVeto: false }

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
        server.socket.on('presidentPickPolicy', (policies: ('fascist' | 'liberal')[]) => {
            updatePlayGameState({ page: 'Pick Policy as President', policies })
        })
        server.socket.on('chancellorPickPolicy', (data: { canVeto: boolean, policies: ('fascist' | 'liberal')[] } ) => {
            updatePlayGameState({ page: 'Pick Policy as Chancellor', policies: data.policies, canVeto: data.canVeto })
        })
        server.socket.on('investigation', (players: Player[]) => {
            updatePlayGameState({ page: 'Investigate', playerList: players })
        })
        server.socket.on('pickNextPresident', (players: Player[]) => {
            updatePlayGameState({ page: 'Pick Next President', playerList: players })
        })
        server.socket.on('peek', (policies: ('fascist' | 'liberal')[]) => {
            updatePlayGameState({ page: 'Peek', policies })
        })
        server.socket.on('kill', (players: Player[]) => {
            updatePlayGameState({ page: 'Kill Player', playerList: players })
        })
        server.socket.on('youDied', () => {
            updatePlayGameState({ message: 'dead', page: 'Message' })
        })
        server.socket.on('requestVeto', () => {
            updatePlayGameState({ page: 'Veto' })
        })
        server.socket.on('success', () => {
            updatePlayGameState({ page: 'Waiting' })
        })

        return () => {
            server.socket.off('error')
            server.socket.off('role')
            server.socket.off('chooseChancellor')
            server.socket.off('chancellorPicked')
            server.socket.off('presidentPickPolicy')
            server.socket.off('chancellorPickPolicy')
            server.socket.off('investigation')
            server.socket.off('pickNextPresident')
            server.socket.off('peek')
            server.socket.off('kill')
            server.socket.off('youDied')
            server.socket.off('requestVeto')
            server.socket.off('success')
        }
    }, [playGameState])

    return {
        playGameState,
        updatePlayGameState,
        fade,
        currentPage,
    }
}
