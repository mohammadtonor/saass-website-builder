import { Contact2Icon } from 'lucide-react'
import React from 'react'

type Props = {}

const ContactFormPlaceholder = (props: Props) => {

    const handleOnDragStart = (e: React.DragEvent, type: string) => {
        if (type === null) return 
        e.dataTransfer.setData("componentType", type)
    }

  return (
    <div
    draggable
      className="h-14 w-14 bg-muted/70 rounded-lg flex justify-center items-center"
      onDragStart={(e) => handleOnDragStart(e, "contactForm")}
    >
      <Contact2Icon className="text-muted-foreground" size={40} />
    </div>
  );
}

export default ContactFormPlaceholder