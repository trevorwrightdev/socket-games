'use client'
import React, { useState } from 'react'
import RainbowText from '@/app/components/RainbowText'

type CounterProps = {
    
}

const Counter:React.FC<CounterProps> = () => {

    const [count, setCount] = useState(0)
    
    return (
        <div className='w-full h-screen grid place-items-center'>
            <RainbowText className='font-bold text-3xl'>{count}</RainbowText>
        </div>  
    )
}
export default Counter