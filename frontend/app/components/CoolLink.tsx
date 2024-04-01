'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

type CoolLinkProps = {
    children: React.ReactNode,
    href: string,
}

const CoolLink:React.FC<CoolLinkProps> = ({ children, href }) => {
    
    const [isHovering, setIsHovering] = useState<boolean>(false)

    return (
        <Link href={href}>
            <div className={`${isHovering ? 'font-bold' : ''} flex flex-col items-center`} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                {children}
                <motion.div
                    animate={{ width: isHovering ? '100%' : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ background: '#434343', height: '2px' }}
                />
            </div>
        </Link>
    )
}
export default CoolLink