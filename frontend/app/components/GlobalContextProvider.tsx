'use client'
import { GameType } from '@/lib/server'
import { ReactNode, createContext, useContext, useState } from 'react'

interface GlobalStateType {
    currentGame: GameType
    name: string
}

const defaultGlobalState: GlobalStateType = {
    currentGame: 'None',
    name: ''
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