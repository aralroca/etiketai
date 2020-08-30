import { useRef, useEffect } from 'react'

import useRedraw from '../../context/useRedraw'
import { useDashboard } from '../../context'

import styles from './styles.module.css'

export default function Right() {
  const redraw = useRedraw()
  const { state, dispatch } = useDashboard()
  const needsRedraw = useRef(false)
  const { boxes = [], boxNames = {}, selectedBox } = state

  useEffect(() => {
    if (!needsRedraw.current) return
    needsRedraw.current = false
    redraw()
  })

  return (
    <div className={styles.right}>
      <p className={styles.title}>Box labels</p>
      <div className={styles.content}>
        {boxes.length === 0 ? (
          <i className={styles.notYet}>No boxes yet.</i>
        )
          : boxes.map((box, index) => (
            <div
              onClick={() => {
                dispatch({ type: 'select-box', data: index })
                needsRedraw.current = true
              }}
              className={`${styles.box} ${selectedBox === index ? styles.active : ''}`}
              key={`${box[0]}-${box[1]}`}
            >
              {boxNames[index + ''] || <i>No label yet</i>}
            </div>
          ))}
      </div>
      <p className={styles.title}>Files</p>
      <div className={styles.content}>
        <i className={styles.notYet}>@todo</i>
      </div>

    </div>
  )
}
