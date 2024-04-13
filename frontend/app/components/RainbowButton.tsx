import React from 'react'

type RainbowButtonProps = {
    children?: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    loading?: boolean
    className?: string
}

const RainbowButton:React.FC<RainbowButtonProps> = ({ children, onClick, disabled, loading, className }) => {
    
    return <button className={`${!disabled ? 'bg-rainbow-less text-white' : 'bg-white text-primary pointer-events-none'} ${loading ? 'pointer-events-none' : ''} rounded-md py-2 px-4 ${className}`} onClick={onClick}>{children}</button>
}

export default RainbowButton