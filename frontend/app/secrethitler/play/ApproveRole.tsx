import React from 'react'

type ApproveRoleProps = {
    roleData: any
}

const ApproveRole:React.FC<ApproveRoleProps> = ({ roleData }) => {
    
    return <div>{roleData.role}</div>
}

export default ApproveRole