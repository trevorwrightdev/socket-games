import React from 'react'

type RainbowButtonProps = {
    children?: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    loading?: boolean
}

const RainbowButton:React.FC<RainbowButtonProps> = ({ children, onClick, disabled, loading }) => {
    
    return <button className={`${!disabled ? 'bg-rainbow-less text-white' : 'bg-white text-primary pointer-events-none'} ${loading ? 'pointer-events-none' : ''} w-20 rounded-md py-2 mt-4 mb-4`} onClick={onClick}>{children}</button>
}

export default RainbowButton