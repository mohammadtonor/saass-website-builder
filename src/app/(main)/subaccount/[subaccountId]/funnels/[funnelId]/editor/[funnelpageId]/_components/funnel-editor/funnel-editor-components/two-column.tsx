import { Badge } from '@/components/ui/badge'
import { EditorBtns, defaultStyles } from '@/lib/constants'
import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import React from 'react'
import { v4 } from 'uuid'
import RecursiveElement from './recursive'
import clsx from 'clsx'
import { Trash } from 'lucide-react'

type Props = {
    element: EditorElement
}

const TwoColumnComponent = (props: Props) => {
    const {id, type, content} = props.element
    const {state, dispatch} = useEditor();

    const handleOnDrop = (e:React.DragEvent, type: string) => {
        e.stopPropagation()
        const componentType = e.dataTransfer.getData('componentType') as EditorBtns
        switch(componentType) {
            case "text": 
                dispatch({
                    type: "ADD_ELEMENT",
                    payload: {
                        containerId: id,
                        elementDetails: {
                            content: {innerText: "Text Component"},
                            id: v4(),
                            name: "Text",
                            styles: {
                                ...defaultStyles
                            },
                            type: "text"
                        }
                    }
                })
                break
            case "container":
                dispatch({
                    type: "ADD_ELEMENT",
                    payload: {
                        containerId: id,
                        elementDetails: {
                            content: [],
                            id: v4(),
                            name: "Container",
                            styles: {...defaultStyles},
                            type: "container"
                        }
                    }
                })
                break;
            case "2Col":
                dispatch({
                  type: "ADD_ELEMENT",
                  payload: {
                    containerId: id,
                    elementDetails: {
                      content: [],
                      id: v4(),
                      name: "Two Columns",
                      styles: { ...defaultStyles },
                      type: "2Col",
                    },
                  },
                });
        }
    }

    const handleOnDragStart = (e: React.DragEvent, type: string) => {
        if (type === "__body") return
        e.dataTransfer.setData('componentType', type)
    }

    const handleOnClickBody = (e: React.MouseEvent) => {
        e.stopPropagation()
        dispatch({
            type: "CHANGE_CLICKED_ELEMENT",
            payload: {
                elementDetails: props.element
            }
        })
    }

    const handleDeleteElement = () => {
        dispatch({
            type: "DELETE_ELEMENT",
            payload: {
                elementDetails: props.element
            }
        })
    }

  return (
    <div
      style={props.element.styles}
      className={clsx("relative p-4 transition-all", {
        "h-fit": type === "container",
        "h-full": type === "__body",
        "m-4": type === "container",
        "!border-blue-500":
          state.editor.selectedElement.id === props.element.id &&
          !state.editor.liveMode,
        "!border-solid":
          state.editor.selectedElement.id === props.element.id &&
          !state.editor.liveMode,
        "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
      })}
      id="innerContainer"
      onDrop={(e) => handleOnDrop(e, id)}
      draggable={type !== "__body"}
      onClick={handleOnClickBody}
      onDragStart={(e) => handleOnDragStart(e, "container")}
    >
      {state.editor.selectedElement.id === id && !state.editor.liveMode && (
        <Badge className="absolute -top-[25px] -left-[1px] rounded-none rounded-t-lg">
          {state.editor.selectedElement.name}
        </Badge>
      )}

      {Array.isArray(content) &&
        content.map((childElement) => (
          <RecursiveElement key={childElement.id} element={childElement} />
        ))}

      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg text-white">
            <Trash
              size={16}
              className="cursor-pointer"
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </div>
  );
}

export default TwoColumnComponent