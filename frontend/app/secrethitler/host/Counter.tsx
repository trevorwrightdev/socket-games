'use client'
import React, { useState, useEffect } from 'react'
import RainbowText from '@/app/components/RainbowText'
import server from '@/lib/server'

type CounterProps = {
    
}

const Counter:React.FC<CounterProps> = () => {

    const [count, setCount] = useState(0)

    useEffect(() => {
        server.socket.on('incremented', (count: number) => {
            setCount(count)
        })

        return () => {
            server.socket.off('incremented')
        }
    }, [])
    
    return (
        <div className='flex flex-col items-center'>
            <RainbowText className='font-bold text-3xl'>{count}</RainbowText>
        </div>  
    )
}
export default Counter