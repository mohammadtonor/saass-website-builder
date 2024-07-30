import { EditorBtns } from '@/lib/constants'
import { PlaySquare} from 'lucide-react'
import React from 'react'

type Props = {}

const VideoPlaceholder = (props: Props) => {
    const handleDragStart = (e:React.DragEvent, type: EditorBtns) => {
        if (type === null) return
        e.dataTransfer.setData("componentType", type)
    }
  return (
    <div
        draggable
        onDragStart={(e) => handleDragStart(e, "video")}
        className='h-14 w-14 bg-muted rounded-lg items-center flex justify-center'
    >
        <PlaySquare 
            size={40}
            className='text-muted-foreground'
        />
    </div>
  )
}

export default VideoPlaceholder