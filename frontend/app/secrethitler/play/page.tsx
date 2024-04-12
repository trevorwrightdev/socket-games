'use client'
import RainbowText from '@/app/components/RainbowText'
import { usePlayGameState } from './usePlayGameState'
import server from '@/lib/server'
import { useEffect, useState } from 'react'
import FadeContainer from '@/app/components/FadeContainer'
import ApproveRole from './ApproveRole'
import { useGlobalState } from '@/app/components/GlobalContextProvider'

export default function Play() {

    const { playGameState, currentPage, updatePlayGameState, fade } = usePlayGameState()
    const [roleData, setRoleData] = useState<any>(null)
    const [globalState] = useGlobalState()

    useEffect(() => {
        server.socket.on('role', (roleData: any) => {
            updatePlayGameState({ page: 'ApproveRole' })
            setRoleData(roleData)
        })

        return () => {
            server.socket.off('role')
        }
    }, [])

    return (
        <div className='flex flex-col items-center'>
            <div className='bg-white w-full h-12 grid place-items-center'>
                <RainbowText className='text-xl font-bold'>Secret Hitler</RainbowText>
                {process.env.NEXT_PUBLIC_DEV_MODE && <p>{globalState.name}</p>}
            </div>
            <FadeContainer fade={fade}>
                <div className='pt-2'>
                    {currentPage === 'ApproveRole' && (
                        <ApproveRole roleData={roleData}/>
                    )}
                </div>
            </FadeContainer>
            <p className='text-red-500 mt-2'>{playGameState.error}</p>
        </div>
    )    
}