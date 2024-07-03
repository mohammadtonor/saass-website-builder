import React from 'react'

const AuthLAyout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='h-full flex items-center justify-center'>{children}</div>
  )
}

export default AuthLAyout