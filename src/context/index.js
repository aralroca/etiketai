import { createContext, useContext, useReducer } from 'react'

const Ctx = createContext({})

const initialState = { files: [] }

function reducer(state, action) {
  switch (action.type) {
    case 'load':
      return { ...state, files: [...action.data, ...state.files], fileIndex: 0 }
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
  const [state, dispatch] = useReducer(reducer, initialState)

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>
}

export function useDashboard() {
  return useContext(Ctx)
}

export default Ctx
