import { EditorElement } from '@/providers/editor/editor-provider'
import React from 'react'
import TextComponent from './text'
import Container from './container'

type Props = {
    element: EditorElement
}

const RecursiveElement = ({element}: Props) => {
    
  switch(element.type) {
    case "text": 
       return <TextComponent element={element}/>
    case "__body":
       return <Container element={element}/>
    case "container": 
        return <Container element={element}/>
    default: 
        return null 
  }
}

export default RecursiveElement