import { useState, useEffect, useRef } from 'react'
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
    messageColor: string
    votes: { vote: boolean, name: string }[]
    showVoteBoard: boolean
}

const defaultGameState: HostGameState = { page: 'Main Menu', roomCode: '', error: '', players: [], message: '', messageColor: 'black', votes: [], showVoteBoard: false}

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

    function setMessage(message: string, color?: string) {
        updateHostGameState({ message, messageColor: color || 'black' })
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
            updateHostGameState({ votes: [], showVoteBoard: false, message, messageColor: 'black'})
        })
        server.socket.on('chancellorPicked', ({ chancellor, president }: {chancellor: Player, president: Player}) => {
            setMessage(`${president.name} has nominated ${chancellor.name} as chancellor. Please vote to decide if these players should be elected.`)
        })
        server.socket.on('vote', (voteData: { vote: boolean, name: string }) => {
            updateHostGameState({ votes: [...hostGameState.votes, voteData] })  
        })
        server.socket.on('votePassed', (message: string) => {
            updateHostGameState({showVoteBoard: true, message, messageColor: 'green'})
        })
        server.socket.on('voteFailed', (message: string) => {
            updateHostGameState({showVoteBoard: true, message, messageColor: 'red'})

            setTimeout(() => {
                server.socket.emit('beginRound')
            }, 7000)
        })

        return () => {
            server.socket.off('error')
            server.socket.off('roomCreated')
            server.socket.off('playerJoined')
            server.socket.off('gameStarted')
            server.socket.off('showGameBoard')
            server.socket.off('newPresident')
            server.socket.off('chancellorPicked')
            server.socket.off('vote')
            server.socket.off('votePassed')
            server.socket.off('voteFailed')
        }
    }, [hostGameState])

    return {
        hostGameState,
        updateHostGameState,
        fade,
        currentPage
    }
}