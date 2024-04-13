import RainbowText from '@/app/components/RainbowText'
import React, { useEffect, useState } from 'react'
import { HostGameState, UpdateHostGameState } from './useHostGameState'
import server from '@/lib/server'

type CountdownProps = {
    hostGameState: HostGameState
    updateHostGameState: UpdateHostGameState
}

const Countdown:React.FC<CountdownProps> = ({ hostGameState, updateHostGameState }) => {

    const [secondsRemaining, setSecondsRemaining] = useState(5)
    const [showOtherMenu, setShowOtherMenu] = useState<boolean>(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsRemaining((currentSeconds) => {
                if (currentSeconds === 1) {
                    setShowOtherMenu(true)
                    server.socket.emit('revealRoles')
                    clearInterval(interval)
                }
                return currentSeconds - 1
            })
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    }, [])

    return (
        <div className='flex flex-col items-center'>
            {!showOtherMenu && (
                <>
                    <h1>Don't let other players see your device.</h1>
                    <h1>Your roles will be revealed in...</h1>
                    <RainbowText className='text-3xl font-bold'>{secondsRemaining}</RainbowText>
                </>
            )}
            {showOtherMenu && (
                <>
                    Press the button on your device to accept your role.
                </>
            )}
        </div>
    )
}

export default Countdown