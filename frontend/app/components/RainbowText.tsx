import React from 'react'

type RainbowTextProps = {
    text: string
}

const colors = ['red', 'orange', 'green', 'blue', 'indigo', 'violet']

const RainbowText:React.FC<RainbowTextProps> = ({ text }) => {
    
    const rainbowText = text.split('').map((char, index) => (
        <span key={index} style={{ color: colors[index % colors.length] }}>
        {char}
        </span>
    ))

  return <div>{rainbowText}</div>
}
export default RainbowText