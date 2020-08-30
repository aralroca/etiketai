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
        ) : (
          boxes
            .slice()
            .reverse()
            .map((box, index) => {
              const realIndex = boxes.length - 1 - index
              const isActive = selectedBox === realIndex

              return (
                <input
                  className={`${styles.box} ${isActive ? styles.active : ''}`}
                  key={`${box[0]}-${box[1]}`}
                  type="text"
                  onClick={() => {
                    if (isActive) return
                    dispatch({ type: 'select-box', data: realIndex })
                    needsRedraw.current = true
                  }}
                  placeholder="No label yet"
                  defaultValue={boxNames[index + ''] || ''}
                  onChange={(e) =>
                    dispatch({ type: 'rename-label', data: e.value })
                  }
                />
              )
            })
        )}
      </div>
      <p className={styles.title}>Files</p>
      <div className={styles.content}>
        <i className={styles.notYet}>@todo</i>
      </div>
    </div>
  )
}
