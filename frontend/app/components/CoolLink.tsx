'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

type CoolLinkProps = {
    children: React.ReactNode,
    href: string,
}

const CoolLink:React.FC<CoolLinkProps> = ({ children, href }) => {
    
    const [hover, setHover] = useState<boolean>(false)

    return (
        <Link href={href}>
            <div className='flex flex-col items-center' onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                {children}
                <motion.div
                    animate={{ width: hover ? '100%' : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ background: '#434343', height: '2px' }}
                />
            </div>
        </Link>
    )
}
export default CoolLink