'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'

type CoolButtonProps = {
    children?: React.ReactNode
    onClick?: () => void
    className?: string
}

const CoolButton:React.FC<CoolButtonProps> = ({ children, onClick, className }) => {
    
    const [isHovering, setIsHovering] = useState<boolean>(false)

    return (
        <div onClick={onClick} className={`${isHovering ? 'font-bold' : ''} flex flex-col items-center cursor-pointer ${className}`} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
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