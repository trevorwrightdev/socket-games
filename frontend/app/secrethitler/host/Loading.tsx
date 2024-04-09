import React from 'react'
import Spinner from 'components/Spinner'

type LoadingProps = {
    
}

const Loading:React.FC<LoadingProps> = () => {
    
    return (
        <div className='flex flex-col items-center'>
            <Spinner />
        </div>
    )
}
export default Loading