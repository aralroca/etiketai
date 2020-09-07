import { useEffect, useRef } from 'react'
import { useDashboard } from '.'
import useRedraw from './useRedraw'

function isRenamingLabel() {
  return (
    document.activeElement.tagName === 'INPUT' &&
    document.activeElement.className.includes('box') &&
    document.activeElement.value
  )
}

export default function useKeyDownControls() {
  const { boxes, dispatch } = useDashboard()
  const redraw = useRedraw()
  const needsRedraw = useRef(false)

  useEffect(() => {
    const keys = new Set(['Escape', 'Backspace', 'd'])
    function onKeyDown(e) {

      if (!keys.has(e.key)) return

      // Duplicate box
      if (e.key === 'd') {
        e.preventDefault()
        if (e.metaKey || e.ctrlKey) dispatch({ type: 'duplicate-box' })
        return
      }

      if (isRenamingLabel()) return
      needsRedraw.current = true
      dispatch({ type: 'remove-box' })
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (needsRedraw.current) redraw()
    needsRedraw.current = false
  }, [boxes.length])
}
