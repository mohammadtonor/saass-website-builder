import { useModal } from '@/providers/modal-provider'
import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'

type Props = {
    title: string
    subheading: string
    children: React.ReactNode
    defaultOpen?: boolean 
}

const CustomModal = ({children, defaultOpen, title, subheading}: Props) => {
    const {isOpen, setClose} = useModal();
  return (
    <Dialog
        open={isOpen || defaultOpen}
        onOpenChange={setClose}  
    >
        <DialogContent className='overflow-hidden overflow-y-scroll md:max-h-[700px] md:h-fit h-screen bg-card'>
            <DialogHeader className='pt-8 text-left'>
                <DialogTitle className='text-2xl font-bold'>{title}</DialogTitle>
                <DialogDescription>{subheading}</DialogDescription>
            </DialogHeader>
            {children}
        </DialogContent>
    </Dialog>
  )
}

export default CustomModal