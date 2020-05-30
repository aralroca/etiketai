import { createContext, useContext, useReducer, useEffect, useRef } from 'react'

const Ctx = createContext({})

const initialState = { files: [], saved: false, size: {} }

function reducer(state, action) {
  switch (action.type) {
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
  const zoom = useRef(1)
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (state.files.length === 0 || state.saved) return

    function beforeunload(e) {
      const confirmationMessage = 'Changes that you made may not be saved.'
      e.returnValue = confirmationMessage
      return confirmationMessage
    }

    window.addEventListener('beforeunload', beforeunload)

    return () => window.removeEventListener('beforeunload', beforeunload)
  }, [state.files, state.saved])

  return (
    <Ctx.Provider value={{ state, dispatch, canvasRef, ctxRef, zoom, imgRef }}>
      {children}
    </Ctx.Provider>
  )
}

export function useDashboard() {
  return useContext(Ctx)
}

export default Ctx
