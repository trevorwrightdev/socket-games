'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import RainbowText from 'components/RainbowText'

type CoolButtonProps = {
    children?: React.ReactNode
    onClick?: () => void
}

const CoolButton:React.FC<CoolButtonProps> = ({ children, onClick }) => {
    
    const [isHovering, setIsHovering] = useState<boolean>(false)

    return (
        <div onClick={onClick} className={`${isHovering ? 'font-bold' : ''} flex flex-col items-center`} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
            {children}
            <motion.div
                animate={{ width: isHovering ? '100%' : 0 }}
                transition={{ duration: 0.25 }}
                className='bg-rainbow h-[2px]'
            />
        </div>
    )
}
export default CoolButton