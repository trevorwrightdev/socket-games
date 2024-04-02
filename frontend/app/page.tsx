'use client'
import CoolButton from '@/app/components/CoolButton'
import Link from 'next/link'
import RainbowText from 'components/RainbowText'
import Input from 'components/Input'
import { useState } from 'react'

const links = [
    { title: 'Secret Hitler', href: '/secrethitler/host' },
]

export default function Home() {

    const [inputValid, setInputValid] = useState<boolean>(false)

  return (
    <main className='flex flex-col items-center pt-24'>
        <RainbowText className='text-3xl mb-4 font-bold' text='trevdev.fun'/>
        <div className='flex flex-col'>
            <h3 className='text-center mb-4 font-bold'>join a game</h3>
            <h3>CODE</h3>
            <Input className='mb-4' placeholder='enter room code'/>
            <h3>NAME</h3>
            <Input placeholder='enter your name'/>
        </div>
        <button className={`${inputValid ? 'bg-rainbow-less text-white' : 'bg-white text-primary pointer-events-none'} w-20 rounded-md py-2 mt-4`}>PLAY</button>
        <h3 className='text-center mb-4 font-bold mt-8'>host a game</h3>
        <div>
            {links.map((link) => {
                return (
                    <Link href={link.href}>
                        <CoolButton key={link.title}>{link.title}</CoolButton>
                    </Link>
                )
            })}
        </div>
    </main>
  )
}
