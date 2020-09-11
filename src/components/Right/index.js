import { useRef, useEffect } from 'react'

import useRedraw from '../../context/useRedraw'
import { useDashboard } from '../../context'

import styles from './styles.module.css'

export default function Right() {
  const redraw = useRedraw()
  const { state, boxes, boxNames, dispatch } = useDashboard()
  const needsRedraw = useRef(false)
  const { selectedBox } = state
  const file = state.files?.[state.fileIndex] || {}
  const labels = [
    ...new Set(Object.values(state.allBoxesNames).flatMap(Object.values)),
  ]

  useEffect(() => {
    if (!needsRedraw.current) return
    needsRedraw.current = false
    redraw()
  })

  return (
    <div className={styles.right}>
      <p className={styles.title}>{file.name || 'Box'} labels</p>
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
                  list="labels"
                  onClick={() => {
                    if (isActive) return
                    dispatch({ type: 'select-box', data: realIndex })
                    needsRedraw.current = true
                  }}
                  placeholder="No label yet"
                  defaultValue={boxNames[realIndex + ''] || ''}
                  onChange={(e) =>
                    dispatch({ type: 'rename-label', data: e.target.value })
                  }
                />
              )
            })
        )}
        {labels.length > 0 && (
          <datalist id="labels">
            {labels.map((label) => (
              <option key={label} value={label} />
            ))}
          </datalist>
        )}
      </div>
      <p className={styles.title}>Files</p>
      <div className={styles.content}>
        {state.files?.length > 0 ? (
          state.files.map((file, index) => (
            <div
              key={index}
              onClick={() => dispatch({ type: 'change-file', data: index })}
              className={`${styles.box} ${
                state.fileIndex === index ? styles.active : ''
              }`}
            >
              {file.name}
            </div>
          ))
        ) : (
          <i className={styles.notYet}>No files yet.</i>
        )}
      </div>
    </div>
  )
}
