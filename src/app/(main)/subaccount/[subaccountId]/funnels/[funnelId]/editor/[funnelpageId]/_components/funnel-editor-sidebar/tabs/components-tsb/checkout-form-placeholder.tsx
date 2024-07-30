import Image from 'next/image'
import React from 'react'

type Props = {}

const CheckoutFormPlaceholder = (props: Props) => {
    const handleDragStart = (e :React.DragEvent, type: string) => {
        if(type === null ) return
        e.dataTransfer.setData('componentType', type)
    }
   return (
    <div
        draggable
        onDragStart={(e) => handleDragStart(e, "paymentForm")}
        className='h-14 w-14 bg-muted rounded-lg items-center justify-center flex'
    >
        <Image 
            src="/stripelogo.png"
            height={40}
            width={40}
            alt='stripe logo'
            className='object-contain'
        />
    </div>
  )
}

export default CheckoutFormPlaceholder