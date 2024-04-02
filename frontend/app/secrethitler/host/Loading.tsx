import React from 'react'
import Spinner from 'components/Spinner'

type LoadingProps = {
    
}

const Loading:React.FC<LoadingProps> = () => {
    
    return (
        <div className='w-full h-screen grid place-items-center'>
            <Spinner />
        </div>
    )
}
export default Loading