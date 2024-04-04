'use client'
import { useGlobalState } from '@/app/components/GlobalContextProvider'

export default function Play() {

    const [globalState, updateGlobalState] = useGlobalState()

    return (
        <div>
            Secret Hitler {globalState.roomCode}
        </div>
    )    
}