import { createContext, useContext, useReducer, useEffect, useRef } from 'react'

const Ctx = createContext({})

const initialState = {
  allBoxes: {},
  allBoxesNames: {},
  files: [],
  saved: false,
  size: {},
  zoom: 0,
}

function reducer(state, action) {
  const boxes = (state.allBoxes[state.fileIndex] || []).slice()
  const boxNames = state.allBoxesNames[state.fileIndex] || {}

  function updateBoxes(b) {
    return {
      ...state.allBoxes,
      [state.fileIndex]: b
    }
  }

  function updateBoxNames(names) {
    return {
      ...state.allBoxesNames,
      [state.fileIndex]: names
    }
  }

  switch (action.type) {
    case 'toggle-save-modal': return {
      ...state,
      isSaveModalOpen: !state.isSaveModalOpen,
    }
    case 'add-box':
      return {
        ...state,
        selectedBox: boxes.length,
        allBoxes: updateBoxes([...boxes, action.data]),
      }
    case 'duplicate-box':
      return {
        ...state,
        selectedBox: boxes.length,
        allBoxes: updateBoxes([...boxes, boxes[state.selectedBox]]),
      }
    case 'move-box': {
      const [osx, osy, omx, omy] = boxes[state.selectedBox]
      const [sx, sy, mx, my] = action.data
      const x = mx - sx
      const y = my - sy

      boxes[state.selectedBox] = [osx + x, osy + y, omx + x, omy + y]

      return { ...state, allBoxes: updateBoxes(boxes) }
    }
    case 'edit-box':
      return {
        ...state,
        selectedBox: action.data.index,
        allBoxes: updateBoxes(boxes
          .map((box, i) => i === action.data.index ? action.data.box : box)
        ),
      }
    case 'remove-box':
      return {
        ...state,
        selectedBox: undefined,
        allBoxes: updateBoxes(boxes.filter((_, i) => i != state.selectedBox)),
      }
    case 'select-box':
      return { ...state, selectedBox: action.data }
    case 'rename-label':
      return {
        ...state,
        allBoxesNames: updateBoxNames({ ...boxNames, [state.selectedBox + '']: action.data }),
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
        files: [...state.files, ...action.data],
        fileIndex: state.files.length,
      }
    case 'next':
      return {
        ...state,
        selectedBox: -1,
        fileIndex:
          state.fileIndex < state.files.length - 1
            ? state.fileIndex + 1
            : state.fileIndex,
      }
    case 'prev':
      return {
        ...state,
        selectedBox: -1,
        fileIndex: state.fileIndex > 0 ? state.fileIndex - 1 : state.fileIndex,
      }
    case 'change-file':
      return {
        ...state,
        selectedBox: -1,
        fileIndex: action.data,
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
  const boxes = state.allBoxes[state.fileIndex] || []
  const boxNames = state.allBoxesNames[state.fileIndex] || {}

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
    <Ctx.Provider value={{ state, boxes, boxNames, dispatch, canvasRef, ctxRef, imgRef }}>
      {children}
    </Ctx.Provider>
  )
}

export function useDashboard() {
  return useContext(Ctx)
}

export default Ctx
