import { createContext, useContext, useReducer, useEffect, useRef } from 'react'

const Ctx = createContext({})

const initialState = {
  allBoxes: {},
  allBoxesNames: {},
  files: [],
  saved: true,
  size: {},
  zoom: 0,
}

function reducer(state, action) {
  const boxes = (state.allBoxes[state.fileIndex] || []).slice()
  const boxNames = { ...(state.allBoxesNames[state.fileIndex] || {}) }

  function updateBoxes(b) {
    return {
      ...state.allBoxes,
      [state.fileIndex]: b,
    }
  }

  function updateBoxNames(names) {
    return { ...state.allBoxesNames, [state.fileIndex]: names }
  }

  switch (action.type) {
    case 'save':
      return {
        ...state,
        saved: true,
      }
    case 'toggle-save-modal':
      return {
        ...state,
        isSaveModalOpen: !state.isSaveModalOpen,
      }
    case 'add-box':
      return {
        ...state,
        selectedBox: boxes.length,
        saved: false,
        allBoxes: updateBoxes([...boxes, action.data]),
      }
    case 'duplicate-box':
      return {
        ...state,
        selectedBox: boxes.length,
        saved: false,
        allBoxes: updateBoxes([...boxes, boxes[state.selectedBox]]),
        allBoxesNames: updateBoxNames({
          ...boxNames,
          [boxes.length]: boxNames[state.selectedBox],
        }),
      }
    case 'move-box': {
      const [osx, osy, omx, omy] = boxes[state.selectedBox]
      const [sx, sy, mx, my] = action.data
      const x = mx - sx
      const y = my - sy

      boxes[state.selectedBox] = [osx + x, osy + y, omx + x, omy + y]

      return { ...state, saved: false, allBoxes: updateBoxes(boxes) }
    }
    case 'edit-box':
      return {
        ...state,
        saved: false,
        selectedBox: action.data.index,
        allBoxes: updateBoxes(
          boxes.map((box, i) =>
            i === action.data.index ? action.data.box : box
          )
        ),
      }
    case 'remove-box': {
      delete boxNames[state.selectedBox]

      return {
        ...state,
        saved: false,
        selectedBox: undefined,
        allBoxes: updateBoxes(boxes.filter((_, i) => i != state.selectedBox)),
        allBoxesNames: updateBoxNames(boxNames),
      }
    }
    case 'select-box':
      return { ...state, selectedBox: action.data }
    case 'rename-label':
      return {
        ...state,
        saved: false,
        allBoxesNames: updateBoxNames({
          ...boxNames,
          [state.selectedBox + '']: action.data,
        }),
      }
    case 'set-zoom':
      return { ...state, zoom: state.zoom + action.data }
    case 'set-size':
      return { ...state, size: action.data }
    case 'load': {
      const { images, allBoxes, allBoxesNames } = action.data

      return {
        ...state,
        files: [...state.files, ...images],
        fileIndex: images.length ? state.files.length : state.fileIndex,
        allBoxes: { ...state.allBoxes, ...allBoxes },
        allBoxesNames: { ...state.allBoxesNames, ...allBoxesNames },
      }
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
    <Ctx.Provider
      value={{ state, boxes, boxNames, dispatch, canvasRef, ctxRef, imgRef }}
    >
      {children}
    </Ctx.Provider>
  )
}

export function useDashboard() {
  return useContext(Ctx)
}

export default Ctx
