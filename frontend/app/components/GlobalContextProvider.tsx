'use client'
import { ReactNode, createContext, useContext, useState } from 'react'
import { GameType } from '@/lib/utils'

interface GlobalStateType {
    currentGame: GameType
    name: string
    roomCode: string
}

const defaultGlobalState: GlobalStateType = {
    currentGame: 'None',
    name: '',
    roomCode: '',
}

type GlobalContextType = [GlobalStateType, (state: Partial<GlobalStateType>) => void]

const defaultGlobalContext: GlobalContextType = [defaultGlobalState, () => {}]

const GlobalContext = createContext<GlobalContextType>(defaultGlobalContext)

export const GlobalContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [globalState, setGlobalState] = useState<GlobalStateType>(defaultGlobalState)

    function updateGlobalState(newState: Partial<GlobalStateType>) {
        setGlobalState({
            ...globalState,
            ...newState
        })
    }

    const value: GlobalContextType = [ globalState, updateGlobalState ]

    return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
}

export const useGlobalState = () => useContext(GlobalContext)