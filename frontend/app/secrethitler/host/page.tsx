'use client'
import io from 'socket.io-client'
import MainMenu from './MainMenu'
import { useGameState, Page } from '../useGameState'
import { useState, useEffect } from 'react'
import FadeContainer from 'components/FadeContainer'

const socket = io('http://localhost:3001')

export default function SecretHitlerHostPage() {

    const { gameState, updateGameState, fade, currentPage } = useGameState()

  return (
    <FadeContainer fade={fade}>
        {currentPage === 'Main Menu' && (
            <MainMenu updateGameState={updateGameState}/>
        )}
        {currentPage === 'How to Play' && (
            <div className='grid place-items-center w-full h-screen'>nice</div>
        )}
    </FadeContainer>
  )
}
