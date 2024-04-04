'use client'
import CoolButton from '@/app/components/CoolButton'
import Link from 'next/link'
import RainbowText from 'components/RainbowText'
import Input from 'components/Input'
import { useState, useEffect } from 'react'
import server, { GameType } from '@/lib/server'
import { useGlobalState } from './components/GlobalContextProvider'
import { useRouter } from 'next/navigation'

const links = [
    { title: 'Secret Hitler', href: '/secrethitler/host' },
]

export default function Home() {
    const [codeValid, setcodeValid] = useState<boolean>(false)
    const [code, setCode] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const [globalState, updateGlobalState] = useGlobalState()

    const router = useRouter()

    async function handleCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
        const newCode = e.target.value
        setCode(newCode)

        if (newCode.length !== 4) {
            setcodeValid(false)
            return
        }

        const [data, error] = await server.validateCode(newCode)
        if (!error) {
            setcodeValid(data)
        }
    }

    function handleJoinGame() {
        server.joinRoom(code, name)
        setLoading(true)
    }

    useEffect(() => {
        server.socket.on('error', (message: string) => {
            setLoading(false)

            setError(message)
        })
        server.socket.on('roomJoined', (response: { gameType: GameType, name: string, roomCode: string 
        }) => {
            setLoading(false)
            updateGlobalState({ currentGame: response.gameType, name: response.name, roomCode: response.roomCode })
            if (response.gameType === 'Secret Hitler') {
                router.push('/secrethitler/play')
            }
        })

        return () => {
            server.socket.off('error')
            server.socket.off('roomJoined')
        }
    }, [])

  return (
    <main className='flex flex-col items-center pt-24'>
        <RainbowText className='text-3xl mb-4 font-bold'>trevdev.fun</RainbowText>
        <div className='flex flex-col'>
            <h3 className='text-center mb-4 font-bold'>join a game</h3>
            <h3>CODE</h3>
            <Input className='mb-4' placeholder='enter room code' value={code} onChange={handleCodeChange} maxLength={4}/>
            <h3>NAME</h3>
            <Input placeholder='enter your name' maxLength={10} value={name} onChange={(e) => setName(e.target.value)}/>
        </div>
        <button className={`${(codeValid && name) ? 'bg-rainbow-less text-white' : 'bg-white text-primary pointer-events-none'} ${loading ? 'pointer-events-none' : ''} w-20 rounded-md py-2 mt-4 mb-4`} onClick={handleJoinGame}>PLAY</button>
        <p className='text-red-500'>{error}</p>
        <h3 className='text-center mb-4 font-bold mt-4'>host a game</h3>
        <div>
            {links.map((link) => {
                return (
                    <Link href={link.href} key={link.title}>
                        <CoolButton >{link.title}</CoolButton>
                    </Link>
                )
            })}
        </div>
    </main>
  )
}
