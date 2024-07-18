"use client"
import ContactUserForm from '@/components/forms/contact-user-form'
import CustomModal from '@/components/global/custom-modal'
import { Button } from '@/components/ui/button'
import { useModal } from '@/providers/modal-provider'
import React from 'react'

type Props = {
    subaccountId: string
}

const CreateContactButton = ({subaccountId}: Props) => {
    const {setOpen} = useModal();

    const handleCreateContact = () => {
        setOpen(
            <CustomModal
                title="Create Or update Contact Information"
                subheading='Contacts are like Customers'
            >
                <ContactUserForm subaccountId={subaccountId} />
            </CustomModal>
        )
    }
  return <Button className='mb-4 ' onClick={handleCreateContact}>Create Contact</Button>;
}

export default CreateContactButton