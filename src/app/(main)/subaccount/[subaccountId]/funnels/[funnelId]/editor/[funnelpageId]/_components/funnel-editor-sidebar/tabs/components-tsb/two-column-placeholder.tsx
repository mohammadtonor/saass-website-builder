import { EditorBtns } from '@/lib/constants'
import React from 'react'

type Props = {}

const TwoColumnPlaceholder = (props: Props) => {
    const handleOnDragStart = (e: React.DragEvent, type: EditorBtns) => {
        if (type === null) return
        e.dataTransfer.setData("componentType", type)
    }
  return (
    <div
        draggable
        onDragStart={(e) => handleOnDragStart(e, '2Col')}
        className='h-14 w-14 bg-muted/70 rounded-lg flex items-center justify-center gap-[2px]'
    >
        <div className="border-dashed border-[1px] h-full rounded-sm bg-muted border-muted-foreground/50 w-full"></div>
        <div className="border-dashed border-[1px] h-full rounded-sm bg-muted border-muted-foreground/50 w-full"></div>
    </div>
  )
}

export default TwoColumnPlaceholder