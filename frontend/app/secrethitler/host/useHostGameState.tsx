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

const defaultGameState: HostGameState = { 
    page: 'Main Menu', 
    roomCode: '', 
    error: '', 
    players: [], 
    message: '', 
    messageColor: 'black', 
    votes: [], 
    showVoteBoard: false, 
}

type PolicyState = { fascistPolicyCount: number, liberalPolicyCount: number } 

export function useHostGameState(): { hostGameState: HostGameState; updateHostGameState: UpdateHostGameState, fade: boolean, currentPage: Page, policyState: PolicyState, failedElectionCount: number} {
    const [hostGameState, setHostGameState] = useState<HostGameState>(defaultGameState)
    const [currentPage, setCurrentPage] = useState<Page>(hostGameState.page)
    const [fade, setFade] = useState<boolean>(false)
    const [policyState, setPolicyState] = useState<PolicyState>({ fascistPolicyCount: 0, liberalPolicyCount: 0 })
    const [failedElectionCount, setFailedElectionCount] = useState<number>(0)

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
            updateHostGameState({ votes: [], showVoteBoard: false, message, messageColor: 'black'})

            if (failedElectionCount >= 3) {
                setFailedElectionCount(0)
            }
        })
        server.socket.on('chancellorPicked', ({ chancellor, president }: {chancellor: Player, president: Player}) => {
            updateHostGameState({ message: `${president.name} has nominated ${chancellor.name} as chancellor. Please vote to decide if these players should be elected.`, messageColor: 'black'})
        })
        server.socket.on('vote', (voteData: { vote: boolean, name: string }) => {
            updateHostGameState({ votes: [...hostGameState.votes, voteData] })  
        })
        server.socket.on('votePassed', (message: string) => {
            updateHostGameState({showVoteBoard: true, message, messageColor: 'green'})
            setFailedElectionCount(0)
        })
        server.socket.on('voteFailed', (data: any) => {
            updateHostGameState({ showVoteBoard: true, message: data.message, messageColor: 'red' })
            setFailedElectionCount(data.failedElectionCount)
        })
        server.socket.on('presidentPickPolicy', (message: string) => {
            updateHostGameState({ message, messageColor: 'black', showVoteBoard: false, votes: []})
        })
        server.socket.on('chancellorPickPolicy', (message: string) => {
            updateHostGameState({ message, messageColor: 'black'})
        })
        server.socket.on('newPolicyEnacted', (data) => {
            setPolicyState({
                fascistPolicyCount: data.fascistPolicyCount,
                liberalPolicyCount: data.liberalPolicyCount
            })
            updateHostGameState({ message: `${data.playerName} has enacted a ${data.newPolicy.toUpperCase()} policy.`, messageColor: data.newPolicy === 'fascist' ? 'red' : 'blue'})
        })
        server.socket.on('electionChaos', (data) => {
            updateHostGameState({ message: data.message, messageColor: 'red'})
            setPolicyState({
                fascistPolicyCount: data.fascistPolicyCount,
                liberalPolicyCount: data.liberalPolicyCount
            })
            setFailedElectionCount(3)
        })
        server.socket.on('gameOver', (data) => {
            updateHostGameState({ message: data.message, messageColor: data.winners === 'fascist' ? 'red' : 'blue'})
        })
        server.socket.on('investigation', (message: string) => {
            updateHostGameState({ message, messageColor: 'black'})
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
            server.socket.off('presidentPickPolicy')
            server.socket.off('chancellorPickPolicy')
            server.socket.off('newPolicyEnacted')
            server.socket.off('electionChaos')
            server.socket.off('gameOver')
            server.socket.off('investigation')
        }
    }, [hostGameState])

    return {
        hostGameState,
        updateHostGameState,
        fade,
        currentPage,
        policyState,
        failedElectionCount
    }
}