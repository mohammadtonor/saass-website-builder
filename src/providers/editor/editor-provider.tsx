"use client";
import { EditorBtns } from "@/lib/constants";
import { FunnelPage } from "@prisma/client";
import React, { Dispatch, act, createContext, useContext, useReducer } from "react";
import { EditorAction } from "./editor-actions";

export type DeviceTypes = "Desktop" | "Mobile" | "Tablet";

export type EditorElement = {
  id: string;
  styles: React.CSSProperties;
  name: string;
  type: EditorBtns;
  content: EditorElement[] | {};
};

export type Editor = {
  liveMode: boolean;
  elements: EditorElement[];
  selectedElement: EditorElement;
  device: DeviceTypes;
  previewMode: boolean;
  funnelPageId: string;
};

export type HistoryState = {
  history: Editor[];
  currentIndex: number;
};

export type EditorState = {
  editor: Editor;
  history: HistoryState;
};

const initialEditorState: EditorState["editor"] = {
  elements: [
    {
      content: [],
      id: "__body",
      name: "Body",
      styles: {},
      type: "__body",
    },
  ],
  selectedElement: {
    id: "",
    content: [],
    name: "",
    styles: {},
    type: null,
  },
  device: "Desktop",
  previewMode: false,
  liveMode: false,
  funnelPageId: "",
};

const initialHistoryState: HistoryState = {
  history: [initialEditorState],
  currentIndex: 0,
};

const initialState: EditorState = {
  editor: initialEditorState,
  history: initialHistoryState,
};

const addAnElement = (
  editorArray: EditorElement[],
  action: EditorAction
): EditorElement[] => {
  if (action.type !== "ADD_ELEMENT")
    throw Error(
      "You sent the wrong action type to the Delete Element editor State"
    );
  return editorArray.map((item) => {
    if (item.id === action.payload.containerId && Array.isArray(item.content)) {
      return {
        ...item,
        content: [...item.content, action.payload.elementDetails],
      };
    } else if (item.content && Array.isArray(item.content)) {
      return {
        ...item,
        content: addAnElement(item.content, action),
      };
    }
    return item;
  });
};

const updateAnElement = (
  editorArray: EditorElement[],
  action: EditorAction
): EditorElement[] => {
  if (action.type !== "UPDATE_ELEMENT") {
    throw Error(
      "You sent the wrong action type to the Update Element editor State"
    );
  }
  return editorArray.map((item) => {
    if (item.id === action.payload.elementDetails.id) {
      return {
        ...item,
        content: action.payload.elementDetails.id,
      };
    } else if (item.content && Array.isArray(item.content)) {
      return {
        ...item,
        content: updateAnElement(item.content, action),
      };
    }
    return item;
  });
};

const deleteAnElement = (
  editorArray: EditorElement[],
  action: EditorAction
): EditorElement[] => {
  if (action.type !== "DELETE_ELEMENT") {
    throw Error(
      "You sent the wrong action type to the Delete Element editor State"
    );
  }
  return editorArray.filter((item) => {
    if (item.id === action.payload.elementDetails.id) {
      return false;
    } else if (item.content && Array.isArray(item.content)) {
      item.content = deleteAnElement(item.content, action);
    }
    return true;
  });
};

const editorReducer = (
  state: EditorState = initialState,
  action: EditorAction
): EditorState => {
  switch (action.type) {
    case "ADD_ELEMENT":
      const updatedEditorState = {
        ...state.editor,
        elements: addAnElement(state.editor.elements, action),
      };
      const updatedHistory = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorState },
      ];

      const newEditorState = {
        ...state,
        editor: updatedEditorState,
        history: {
          ...state.history,
          history: updatedHistory,
          currentIndex: updatedHistory.length - 1,
        },
      };
      return newEditorState;

    case "UPDATE_ELEMENT":
      const updateElements = updateAnElement(state.editor.elements, action);
      const UpdateElementIsSelected =
        state.editor.selectedElement.id === action.payload.elementDetails.id;

      const updateEditorWithUpdate = {
        ...state.editor,
        elements: updateElements,
        selectedElement: UpdateElementIsSelected
          ? action.payload.elementDetails
          : {
              id: "",
              content: [],
              name: "",
              styles: {},
              type: null,
            },
      };

      const updatedHistorywithUpdate = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updateEditorWithUpdate },
      ];

      const updatedEditor = {
        ...state,
        editor: updateEditorWithUpdate,
        history: {
          ...state.history,
          history: updatedHistorywithUpdate,
          currentIndex: updatedHistorywithUpdate.length - 1,
        },
      };

      return updatedEditor;

    case "DELETE_ELEMENT":
      const updatedElementsAfterDelete = deleteAnElement(
        state.editor.elements,
        action
      );

      const updatedEditorStateAfterDelete = {
        ...state.editor,
        elements: updatedElementsAfterDelete,
      };

      const updatedHistoryAfterDelete = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorStateAfterDelete },
      ];

      const deleteState = {
        ...state,
        editor: updatedEditorStateAfterDelete,
        history: {
          history: updatedHistoryAfterDelete,
          currentIndex: updatedHistoryAfterDelete.length - 1,
        },
      };
      return deleteState;

    case "CHANGE_CLICKED_ELEMENT":
      const clickState = {
        ...state,
        editor: {
          ...state.editor,
          selectedElement: action.payload.elementDetails || {
            id: "",
            content: [],
            name: "",
            styles: {},
            type: null,
          },
        },
        history: {
          ...state.history,
          history: [
            ...state.history.history.slice(0, state.history.currentIndex + 1),
            { ...state.editor },
          ],
          currentIndex: state.history.currentIndex + 1,
        },
      };
      return clickState;

    case "CHANGE_DEVICE":
      const changeDeviceId = {
        ...state,
        editor: {
          ...state.editor,
          device: action.payload.device,
        },
      };
      return changeDeviceId;
    case "TOGGLE_PREVIEW_MODE":
      const toggleState = {
        ...state,
        editor: {
          ...state.editor,
          previewMode: !state.editor.previewMode,
        },
      };
      return toggleState;
    case "TOGGLE_LIVE_MODE":
      const toggleLiveMode = {
        ...state,
        editor: {
          ...state.editor,
          liveMode: !state.editor.liveMode,
        },
      };
      return toggleLiveMode;
    case "REDO":
      if (state.history.currentIndex < state.history.history.length - 1) {
        const nextIndex = state.history.currentIndex + 1;
        const nextEditorState = { ...state.history.history[nextIndex] };
        const redoState = {
          ...state,
          editor: nextEditorState,
          history: {
            ...state.history,
            currentIndex: nextIndex,
          },
        };
        return redoState;
      }
      return state;

    case "UNDO":
      if (state.history.currentIndex > 0) {
        const prevIndex = state.history.currentIndex - 1;
        const prevEditorState = { ...state.history.history[prevIndex] };
        const undoState = {
          ...state,
          editor: prevEditorState,
          history: {
            ...state.history,
            currentIndex: prevIndex,
          },
        };
        return undoState;
      }
      return state;

    case "LOAD_DATA":
      return {
        ...initialState,
        editor: {
          ...initialState.editor,
          elements: action.payload.elements || initialEditorState.elements,
          liveMode: !!action.payload.withLive,
        },
      };

    case "SET_FUNNELPAGE_ID":
      const {funnelPageId} = action.payload
      const updateEditorStatewithFunnelPageId = {
        ...state.editor,
        funnelPageId,
      }

      const updateHistorywithFunnelPadeId = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        {
         ...updateEditorStatewithFunnelPageId,
        },
      ];

      const funnelPageIdState = {
        ...state,
        editor: updateEditorStatewithFunnelPageId,
        history: {
         ...state.history,
          history: updateHistorywithFunnelPadeId,
          currentIndex: updateHistorywithFunnelPadeId.length - 1,
        },
      }
      return funnelPageIdState;
    default:
      return state;
  }
};

export type EditorContextData = {
    device: DeviceTypes
    previewMode: boolean
    setPreviewMode: (mode:boolean) => void;
    setDevice: (device:DeviceTypes) => void;
} 
export const EditorContext = createContext<{
    state: EditorState
    dispatch: Dispatch<EditorAction>
    subaccountId: string
    funnelId: string
    pageDetails: FunnelPage | null
}>({
    state: initialState,
    dispatch: () => undefined,
    subaccountId: "",
    funnelId: "",
    pageDetails: null,
})

type EditiorProps = {
    subaccountId: string;
    funnelId: string;
    pageDetails: FunnelPage;
    children: React.ReactNode;
};

const EditorProvider = (props: EditiorProps) => {
  const [state, dispatch] = useReducer(editorReducer, initialState)

  return (
    <EditorContext.Provider
      value={{
        state,
        dispatch,
        subaccountId: props.subaccountId,
        funnelId: props.funnelId,
        pageDetails: props.pageDetails,
      }}
    >
      {props.children}
    </EditorContext.Provider>
  )
}

export const useEditor = () => {
    const context = useContext(EditorContext);
    if(!context) {
        throw new Error("useEditor must be used within an EditorProvider")
    }
    return context;
}

export default EditorProvider;
