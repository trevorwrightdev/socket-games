'use client'
import io from 'socket.io-client'
import MainMenu from './MainMenu'
import { useState } from 'react'

const socket = io('http://localhost:3001')

type Page = 'Main Menu' 

export default function SecretHitlerHostPage() {

    const [page, setPage] = useState<Page>('Main Menu')

  return (
    <main>
        {page === 'Main Menu' && (
            <MainMenu />
        )}
    </main>
  )
}
