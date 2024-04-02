import React from 'react'
import { motion } from 'framer-motion'

type FadeContainerProps = {
    fade: boolean
    children: React.ReactNode
}

const FadeContainer: React.FC<FadeContainerProps> = ({ fade, children }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: fade ? 0 : 1 }}
            transition={{ duration: 0.25 }} 
            className={fade ? 'pointer-events-none' : ''}
        >
            {children}
        </motion.div>
    )
}

export default FadeContainer
