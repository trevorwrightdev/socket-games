import React from 'react'

type ApproveRoleProps = {
    roleData: any
}

const ApproveRole:React.FC<ApproveRoleProps> = ({ roleData }) => {
    
    return (
        <div className='flex flex-col items-center'>
            {roleData.role === 'hitler' && (
                <p>😈 You are HITLER. 😈</p>
            )}
            {(!roleData.otherFascists || roleData.otherFascists.length === 0) && roleData.role === 'hitler' && (
                <p className='text-center'>You do not know who your fellow fascists are, but they know that you are Hitler.</p>
            )}
            {roleData.role === 'fascist' && (
                <p>🔪 You are a FASCIST. 🔪</p>
            )}
            {roleData.role === 'liberal' && (
                <p>😊 You are a LIBERAL. 😊</p>
            )}
            {roleData.hitler && (
                <p>{roleData.hitler} is HITLER.</p>
            )}
            {roleData.otherFascists && roleData.otherFascists.length > 0 && (
                <div className='flex flex-col items-center'>
                    <p>Your fellow fascists are:</p>
                    {roleData.otherFascists.map((fascistName: any) => (
                        <p>
                            {fascistName}
                        </p>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ApproveRole