import { useEffect } from 'react'

import useMenu from './useMenu'
import useZoom from './useZoom'
import { useDashboard } from '.'

function isRenamingLabel() {
  return (
    document.activeElement.tagName === 'INPUT' &&
    document.activeElement.className.includes('box')
  )
}

export default function useKeyDownControls() {
  const { state } = useDashboard()
  const menu = useMenu()
  const modalOpen = state.isSaveModalOpen
  const onZoom = useZoom()

  useEffect(() => {
    function onKeyDown(e) {
      if (modalOpen || isRenamingLabel()) return

      if (e.key === '0') {
        onZoom(-state.zoom)
        return
      }

      for (let m of menu) {
        if (m.disabled || !m.hotkey || !m.hotkey(e)) continue

        e.preventDefault()

        if (m.type === 'input[file]') {
          document.querySelector('input[type=file]').click()
          return
        }

        m.action()
        return
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [state, modalOpen, menu])
}
