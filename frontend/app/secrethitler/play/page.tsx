'use client'
import RainbowText from '@/app/components/RainbowText'
import { usePlayGameState } from './usePlayGameState'
import FadeContainer from '@/app/components/FadeContainer'
import ApproveRole from './ApproveRole'
import { useGlobalState } from '@/app/components/GlobalContextProvider'
import ChooseChancellor from './ChooseChancellor'
import Vote from './Vote'
import PickPolicyAsPresident from './PickPolicyAsPresident'
import PickPolicyAsChancellor from './PickPolicyAsChancellor'
import InvestigateRole from './InvestigateRole'
import PickPresident from './PickPresident'
import PeekPolicies from './PeekPolicies'
import ChoosePlayerToKill from './ChoosePlayerToKill'
import Message from './Message'
import Veto from './Veto'
import server from '@/lib/server'

export default function Play() {

    const { playGameState, currentPage, updatePlayGameState, fade, lastWaitTimestamp } = usePlayGameState()
    const [globalState] = useGlobalState()

    function resync() {
        server.resync(lastWaitTimestamp)
    }

    return (
        <div className='flex flex-col items-center'>
            <div className='bg-white w-full h-12 grid place-items-center'>
                <RainbowText className='text-xl font-bold'>Secret Hitler</RainbowText>
                {process.env.NEXT_PUBLIC_DEV_MODE && <p>{globalState.name}</p>}
            </div>
            <FadeContainer fade={fade}>
                <div className='pt-2 relative flex flex-col items-center'>
                    {currentPage === 'ApproveRole' && (
                        <ApproveRole roleData={playGameState.roleData} updatePlayGameState={updatePlayGameState}/>
                    )}
                    {currentPage === 'Choose Chancellor' && (
                        <ChooseChancellor playGameState={playGameState} updatePlayGameState={updatePlayGameState}/>
                    )}
                    {currentPage === 'Vote' && (
                        <Vote playGameState={playGameState} updatePlayGameState={updatePlayGameState}/>
                    )}
                    {currentPage === 'Pick Policy as President' && (
                        <PickPolicyAsPresident playGameState={playGameState} updatePlayGameState={updatePlayGameState}/>
                    )}
                    {currentPage === 'Pick Policy as Chancellor' && (
                        <PickPolicyAsChancellor playGameState={playGameState} updatePlayGameState={updatePlayGameState}/>
                    )}
                    {currentPage === 'Investigate' && (
                        <InvestigateRole playGameState={playGameState} updatePlayGameState={updatePlayGameState}/>
                    )}
                    {currentPage === 'Pick Next President' && (
                        <PickPresident playGameState={playGameState} updatePlayGameState={updatePlayGameState}/>
                    )}
                    {currentPage === 'Peek' && (
                        <PeekPolicies playGameState={playGameState} updatePlayGameState={updatePlayGameState}/>
                    )}
                    {currentPage === 'Kill Player' && (
                        <ChoosePlayerToKill playGameState={playGameState} updatePlayGameState={updatePlayGameState}/>
                    )}
                    {currentPage === 'Message' && (
                        <Message playGameState={playGameState}/>
                    )}
                    {currentPage === 'Veto' && (
                        <Veto updatePlayGameState={updatePlayGameState}/>
                    )}
                    {process.env.NEXT_PUBLIC_DEV_MODE && <button className='text-sm text-white absolute top-[350px] opacity-10 bg-gray-900 rounded-md px-1' onClick={() => server.socket.disconnect()}>disconnect</button>}
                    <button className='text-sm text-white absolute top-[400px] opacity-10 bg-gray-900 rounded-md px-1' onClick={resync}>resync</button>
                </div>
            </FadeContainer>
            <p className='text-red-500 mt-2'>{playGameState.error}</p>
        </div>
    )    
}