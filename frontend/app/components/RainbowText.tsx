import React from 'react'

type RainbowTextProps = {
    children?: React.ReactNode
    className?: string
}

const RainbowText:React.FC<RainbowTextProps> = ({ children, className }) => {
    
    const style = {
        background: 'linear-gradient(to right, red, orange, green, blue, indigo, violet)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        display: 'inline',
    }

  return <span style={style} className={className}>{children}</span>
}
export default RainbowText