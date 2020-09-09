import { useEffect, useRef } from 'react'
import { useDashboard } from '.'
import useRedraw from './useRedraw'

const keys = new Set(['Escape', 'Backspace', 'd', 'ArrowRight', 'ArrowLeft'])

function isRenamingLabel() {
  return (
    document.activeElement.tagName === 'INPUT' &&
    document.activeElement.className.includes('box') &&
    document.activeElement.value
  )
}

export default function useKeyDownControls() {
  const { state, boxes, dispatch } = useDashboard()
  const redraw = useRedraw()
  const needsRedraw = useRef(false)
  const modalOpen = state.isSaveModalOpen

  useEffect(() => {
    function onKeyDown(e) {
      if (!keys.has(e.key) || modalOpen) return

      if (e.key === 'ArrowRight' && !isRenamingLabel()) {
        dispatch({ type: 'next' })
        return
      }

      if (e.key === 'ArrowLeft' && !isRenamingLabel()) {
        dispatch({ type: 'prev' })
        return
      }

      if (e.key === 'd') {
        if (!e.metaKey && !e.ctrlKey) return

        // Duplicate box
        e.preventDefault()
        dispatch({ type: 'duplicate-box' })
        return
      }

      if (isRenamingLabel()) return
      needsRedraw.current = true
      dispatch({ type: 'remove-box' })
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [state, modalOpen])

  useEffect(() => {
    if (needsRedraw.current) redraw()
    needsRedraw.current = false
  }, [boxes.length])
}
