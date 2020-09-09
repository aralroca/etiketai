import React, { useEffect } from 'react'

import styles from './styles.module.css'

export default function Modal({ children, title, onClose, open }) {
  // Close modal on press ESC or Backspace
  useEffect(() => {
    if (!open) return

    function onKeyDown(e) {
      const closeAction = e.key === 'Escape' || e.key === 'Backspace'
      if (closeAction && typeof onClose === 'function') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  if (!open) return

  return (
    <div onClick={onClose} className={styles.dialogWrapper}>
      <dialog open onClick={(e) => e.stopPropagation()}>
        <header>
          <span>{title}</span>
          <button title="Close" onClick={onClose}>X</button>
        </header>
        <div className={styles.content}>{children}</div>
      </dialog>
    </div>
  )
}
