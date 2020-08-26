import { useEffect, useRef } from "react"
import { useDashboard } from "."
import useRedraw from "./useRedraw"

export default function useKeyDownControls() {
  const { state, dispatch } = useDashboard()
  const redraw = useRedraw()
  const needsRedraw = useRef(false)

  useEffect(() => {
    const keys = new Set(['Escape', 'Backspace'])
    function onKeyDown(e) {
      if (!keys.has(e.key)) return
      needsRedraw.current = true
      dispatch({ type: 'remove-box' })
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (needsRedraw.current) redraw()
    needsRedraw.current = false
  }, [state.boxes?.length])
}
