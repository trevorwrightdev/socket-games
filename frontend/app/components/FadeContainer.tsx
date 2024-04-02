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
            animate={{ opacity: fade ? 1 : 0 }}
            transition={{ duration: 0.25 }} 
        >
            {children}
        </motion.div>
    )
}

export default FadeContainer
