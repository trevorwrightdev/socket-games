import React from 'react'
import RainbowText from 'components/RainbowText'

type MainMenuProps = {
    
}

const MainMenu:React.FC<MainMenuProps> = () => {
    
    return (
        <div className='w-full h-screen grid place-items-center'>
            <div className='flex flex-col items-center'>
                <RainbowText className='text-3xl font-bold' text='Secret Hitler'/>
            </div>
        </div>
    )
}
export default MainMenu;