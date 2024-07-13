"use client"
import { deleteSubaccount, getSubaccountDetails, saveActivityLogNotification } from '@/lib/queries'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
    subaccountId:string
}

const DeleteButton = ({subaccountId}: Props) => {
    const router = useRouter();
console.log(subaccountId);

  return (
    <div
        className='text-white'
        onClick={async () => {
            const response = await getSubaccountDetails(subaccountId)
            console.log(response?.agencyId);
            await saveActivityLogNotification({
                agencyId: response?.agencyId,
                description: `Deleted sub account | ${response?.name}`,
                subaccountId,
            })
            await deleteSubaccount(subaccountId);
            router.refresh();
        }}
    >
        Delete Sub Account
    </div>
  )
}

export default DeleteButton