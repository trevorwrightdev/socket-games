import React from 'react'

type InputProps = {
    placeholder?: string
    className?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    maxLength?: number
}

const Input:React.FC<InputProps> = ({ placeholder, className, value, onChange, maxLength }) => {

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        // capitalize the input 
        e.target.value = e.target.value.toUpperCase()

        if (onChange) {
            onChange(e)
        }
    }

    return <input type="text" className={`outline-none p-1 ${className}`} placeholder={placeholder} value={value} onChange={handleOnChange} maxLength={maxLength}/>
}

export default Input