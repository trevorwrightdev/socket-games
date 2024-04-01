import React from 'react'

type RainbowTextProps = {
    text: string
    className?: string
}

const RainbowText:React.FC<RainbowTextProps> = ({ text, className }) => {
    
    const style = {
        background: 'linear-gradient(to right, red, orange, green, blue, indigo, violet)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        display: 'inline',
    }

  return <span style={style} className={className}>{text}</span>
}
export default RainbowText