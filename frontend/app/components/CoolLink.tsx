'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import RainbowText from 'components/RainbowText'

type CoolLinkProps = {
    href: string,
    title: string
}

const CoolLink:React.FC<CoolLinkProps> = ({ href, title }) => {
    
    const [isHovering, setIsHovering] = useState<boolean>(false)

    return (
        <Link href={href}>
            <div className={`${isHovering ? 'font-bold' : ''} flex flex-col items-center`} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                {title}
                <motion.div
                    animate={{ width: isHovering ? '100%' : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ background: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)', height: '2px' }}
                />
            </div>
        </Link>
    )
}
export default CoolLink