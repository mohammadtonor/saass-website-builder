import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { EditorBtns } from '@/lib/constants'
import React from 'react'
import TextPlaceholder from './text-placeholder';
import ContainerPaceholder from './container-paceholder';
import VideoPlaceholder from './video-placeholder';
import LinkPlaceholder from './link-placeholder';
import TwoColumnPlaceholder from './two-column-placeholder';
import ContactFormPlaceholder from './contact-form-placeholder';
import CheckoutFormPlaceholder from './checkout-form-placeholder';

type Props = {}

const ComponentsTab = (props: Props) => {
    const elements: {
        Component: React.ReactNode
        label: string
        id: EditorBtns
        group: "layout" | "element"
    } [] = [
        {
            Component: <TextPlaceholder />,
            label: "Text",
            id: "text",
            group: "element"
        },
        {
            Component: <ContainerPaceholder  />,
            label: "Container",
            id: "container",
            group: "layout"
        },
        {
            Component: <VideoPlaceholder />,
            label: "Video",
            id: "video",
            group: "element"
        },
        {
            Component: <LinkPlaceholder />,
            label: "Link",
            id: "link",
            group: "element"
        },
        {
            Component: <TwoColumnPlaceholder />,
            label: "2 Columns",
            id: "2Col",
            group: "layout"
        },
        {
            Component: <ContactFormPlaceholder />,
            label: "Contact",
            id: "contactForm",
            group: "element"
        },
        {
            Component: <CheckoutFormPlaceholder />,
            label: "Checkout",
            id: "paymentForm",
            group: "element"
        },
    ];

  return (
    <Accordion
        type='multiple'
        className='w-full'
        defaultValue={['Layout', 'Elements']}
    >
        <AccordionItem 
            value='Layout'
            className='px-6 py-0 border-y-[1px]'
        >
           <AccordionTrigger className='!no-underline'>Layout</AccordionTrigger> 
           <AccordionContent className='flex flex-wrap gap-2'>
            {elements.filter(element => element.group === 'layout')
            .map(element => (
                <div 
                    className=""
                    key={element.id}
                >
                    {element.Component}
                    <span className='text-muted-foreground'>{element.label}</span>
                </div>
            ))}
           </AccordionContent>
        </AccordionItem>
        <AccordionItem 
            value='Elements'
            className='px-6 py-0'
        >
            <AccordionTrigger className='!no-underline'>Elements</AccordionTrigger>
            <AccordionContent className='flex flex-wrap gap-2'>
                {elements.filter(element => element.group === "element")
                .map(element => (
                    <div className="flex-col items-center justify-center flex" key={element.id}>
                        {element.Component}
                        <span className='text-muted-foreground'>{element.label}</span>
                    </div>
                ))}
            </AccordionContent>
        </AccordionItem>
    </Accordion>
  )
}

export default ComponentsTab