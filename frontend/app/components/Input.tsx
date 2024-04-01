import React from 'react'

type InputProps = {
    placeholder?: string
    className?: string
}

const Input:React.FC<InputProps> = ({ placeholder, className }) => {
    return <input type="text" className={`outline-none p-1 ${className}`} placeholder={placeholder}/>
}
export default Input