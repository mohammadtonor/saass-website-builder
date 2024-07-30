import ContactForm from '@/components/forms/contact-form'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { EditorBtns } from '@/lib/constants'
import { getFunnel, saveActivityLogsNotification, upsertContact } from '@/lib/queries'
import { ContactFormSchema } from '@/lib/types'
import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { z } from 'zod'

type Props = {
    element: EditorElement
}

const ContactFormComponent = (props: Props) => {
    const {dispatch, state, subaccountId, funnelId, pageDetails} = useEditor();
    const router = useRouter()

    const handleDragStart = (e: React.DragEvent, type: EditorBtns) =>  {
        if(type === null) return
        e.dataTransfer.setData("componentType", type);
    }

    const handleOnClickBody = (e: React.MouseEvent) => {
        e.stopPropagation()
        dispatch({
            type: 'CHANGE_CLICKED_ELEMENT',
            payload: {
                elementDetails: props.element
            }
        })
    }

    const styles = props.element.styles

    const getNextPage = async () => {
        if(!state.editor.liveMode) return
        const funnelPages = await getFunnel(funnelId)
        if(!funnelPages || !pageDetails ) return
        if(funnelPages?.FunnelPages.length > pageDetails.order + 1) {
            console.log(funnelPages?.FunnelPages.length , pageDetails.order + 1);
             const nextPage = funnelPages.FunnelPages.find(
                page => page.order === pageDetails.order + 1
             )
             if(!nextPage) return
             router.replace(`${process.env.NEXT_PUBLIC_SCHEME}${funnelPages.subDomainName}${process.env.NEXT_PUBLIC_DOMAIN}/${nextPage.pathName}`)
        }
    }

    const handleDeleteElement = () => {
        dispatch({
            type: "DELETE_ELEMENT",
            payload: {
                elementDetails: props.element
            }
        })
    }
    
    const handeOnFormSubmit = async (
        values: z.infer<typeof ContactFormSchema>
    ) => {
        if(!state.editor.liveMode) return;
        try {
            const response = await upsertContact({
                ...values,
                subAccountId: subaccountId
            });
            await saveActivityLogsNotification({
                agencyId: undefined,
                description: `A New Contact signrd up | ${response.name}`,
                subaccountId: subaccountId
            })
            await getNextPage();
            toast({
                title: "Success",
                description: "Successfuly Saved your info."
            })
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Failed",
                description: "Could not save your information"
            })
        }
    }

  return (
    <div
        style={styles}
        draggable
        onDragStart={(e)=> handleDragStart(e, "contactForm")}
        onClick={handleOnClickBody}
        className={clsx(
            'p-[2px] w-full m-[5px] relative text-[16px] transition-all flex items-center justify-center',
        {
          '!border-blue-500':
            state.editor.selectedElement.id === props.element.id,

          '!border-solid': state.editor.selectedElement.id === props.element.id,
          'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
        }
        )}
    >
        {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
            <Badge
                className='absolute -top-[25px] -left-[1px] rounded-none rounded-t-lg'
            ></Badge>
        )}
        <ContactForm 
            subTitle='Conatact Us'
            title='Want a free Qoute? We can help you.'
            apiCall={handeOnFormSubmit}
        /> 

        {state.editor.selectedElement.id === props.element.id && 
        !state.editor.liveMode && (
            <div className="absolute px-2.5 py-1 bg-primary text-white rounded-none text-xs font-bold rounded-t-lg -top-[25px] -right-[1px]">
                <Trash 
                    className='cursor-pointer'
                    size={16}
                    onClick={handleDeleteElement}
                />
            </div>
        )}
    </div>
  )
}

export default ContactFormComponent