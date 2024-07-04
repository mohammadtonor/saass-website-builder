import { ClerkProvider } from '@clerk/nextjs'
import React from 'react'
import { dark } from '@clerk/themes';

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <ClerkProvider
        appearance={{ baseTheme: dark }}
    >
        {children}
    </ClerkProvider>
  )
}

export default layout