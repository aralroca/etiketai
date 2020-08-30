import { createContext, useContext, useReducer, useEffect, useRef } from 'react'

const Ctx = createContext({})

const initialState = {
  files: [],
  saved: false,
  size: {},
  zoom: 0,
  boxNames: {},
}

function reducer(state, action) {
  switch (action.type) {
    case 'add-box': {
      const boxes = state.boxes || []
      return {
        ...state,
        selectedBox: boxes.length,
        boxes: [...boxes, action.data],
      }
    }
    case 'edit-last-box':
      return {
        ...state,
        selectedBox: state.boxes.length - 1,
        boxes: [
          ...state.boxes.filter((_, i) => i < state.boxes.length - 1),
          action.data,
        ],
      }
    case 'remove-box':
      return {
        ...state,
        selectedBox: undefined,
        boxes: (state.boxes || []).filter((_, i) => i != state.selectedBox),
      }
    case 'select-box':
      return { ...state, selectedBox: action.data }
    case 'rename-label':
      return {
        ...state,
        boxNames: { ...state.boxNames, [state.selectedBox + '']: action.data },
      }
    case 'reset-zoom':
      return { ...state, zoom: initialState.zoom }
    case 'set-zoom':
      return { ...state, zoom: state.zoom + action.data }
    case 'set-size':
      return { ...state, size: action.data }
    case 'load':
      return {
        ...state,
        saved: false,
        files: [...action.data, ...state.files],
        fileIndex: 0,
      }
    case 'next':
      return {
        ...state,
        fileIndex:
          state.fileIndex < state.files.length - 1
            ? state.fileIndex + 1
            : state.fileIndex,
      }
    case 'prev':
      return {
        ...state,
        fileIndex: state.fileIndex > 0 ? state.fileIndex - 1 : state.fileIndex,
      }
    default:
      throw new Error()
  }
}

export function DashboardProvider({ children }) {
  const canvasRef = useRef()
  const ctxRef = useRef()
  const imgRef = useRef()
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (state.files.length === 0 || state.saved) return
    if (process.env.NODE_ENV !== 'production') return

    function beforeunload(e) {
      const confirmationMessage = 'Changes that you made may not be saved.'
      e.returnValue = confirmationMessage
      return confirmationMessage
    }

    window.addEventListener('beforeunload', beforeunload)

    return () => window.removeEventListener('beforeunload', beforeunload)
  }, [state.files, state.saved])

  return (
    <Ctx.Provider value={{ state, dispatch, canvasRef, ctxRef, imgRef }}>
      {children}
    </Ctx.Provider>
  )
}

export function useDashboard() {
  return useContext(Ctx)
}

export default Ctx
