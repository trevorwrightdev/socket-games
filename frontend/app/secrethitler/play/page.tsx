'use client'
import { useGlobalState } from '@/app/components/GlobalContextProvider'
import RainbowText from '@/app/components/RainbowText'

export default function Play() {

    const [globalState, updateGlobalState] = useGlobalState()

    return (
        <div className='flex flex-col items-center'>
            <div className='bg-white w-full h-12 grid place-items-center'>
                <RainbowText className='text-xl font-bold'>Secret Hitler</RainbowText>
            </div>
        </div>
    )    
}