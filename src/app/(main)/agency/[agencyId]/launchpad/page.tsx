import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

type Props = {}

const LaunchpadPage = (props: Props) => {
  return (
    <div className='flex flex-col justify-center items-center'>
      <div className="w-full h-full max-w-[800px]">
        <Card className=''>
          <CardHeader>
            <CardTitle>Lets Get Satarted</CardTitle>
            <CardDescription>Follw the steps bellow to get your account setup</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

export default LaunchpadPage