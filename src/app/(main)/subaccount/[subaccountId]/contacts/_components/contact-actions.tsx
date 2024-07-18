"use client"
import React from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Edit, MoreVertical, Trash } from 'lucide-react'
import { Contact } from '@prisma/client'
import CustomModal from '@/components/global/custom-modal'
import ContactUserForm from '@/components/forms/contact-user-form'
import { useModal } from '@/providers/modal-provider'
import { deleteContact, saveActivityLogsNotification } from '@/lib/queries'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

type Props = {
    subaccountId: string
    contactData?: Contact
}

const ContactActions = ({subaccountId, contactData}: Props) => {
    const {setOpen } = useModal();
    const router = useRouter()

    const handleEditContact = () => {
        setOpen(
            <CustomModal
              title="Edit Lane Details"
              subheading=""
            >
              <ContactUserForm
                subaccountId={subaccountId}
                defaultData={contactData}
              />
            </CustomModal>
          )
    }

    const handleDeleteContact = async () => {
        try {
            const response = await deleteContact(contactData?.id);
            await saveActivityLogsNotification({
                agencyId: undefined,
                description: `Deleted a contact | ${response?.name}`,
                subaccountId: subaccountId,
            })
            toast({
                title: 'Deleted Contact',
                description: 'Successfully deleted the contact',
              })
              router.refresh()
        } catch (error) {
            toast({
                variant: "destructive",
                title: 'Oppse',
                description: "Error deleting contact",
              });
        }

    }

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical className="text-muted-foreground cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <AlertDialogTrigger className="w-full">
            <DropdownMenuItem className="flex items-center gap-2 ">
              <Trash size={15} />
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={handleEditContact}
          >
            <Edit size={15} />
            Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive"
              onClick={handleDeleteContact}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </DropdownMenu>
    </AlertDialog>
  );
}

export default ContactActions