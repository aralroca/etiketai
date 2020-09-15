import { useState } from 'react'

import getImgSizeOnCanvas from '../../utils/getImgSizeOnCanvas'
import useKeyDownControls from '../../context/useKeyDownControls'
import useZoom from '../../context/useZoom'
import { useDashboard } from '../../context'
import { useLoadImage, useSelectBox } from '../../context/useRedraw'

import styles from './styles.module.css'

let startX
let startY
let isDown
let newBox
let movingBox
let resizing

export default function Center() {
  const [xy, setXY] = useState()
  const { state, boxes, canvasRef, dispatch } = useDashboard()
  const onZoom = useZoom()
  const file = state.files[state.fileIndex]
  const selectBox = useSelectBox()
  const imgRes = useLoadImage()
  const zoom = Math.pow(1.1, state.zoom)
  const [originalW, originalH, wZoom, hZoom] = getImgSizeOnCanvas(imgRes, zoom)

  useKeyDownControls()

  function getXY(e) {
    const { left, top } = canvasRef.current.getBoundingClientRect()
    const x = Math.round(
      (((e.clientX - left - (state.size.width / 2 - wZoom / 2)) / zoom) *
        imgRes.w) /
        originalW
    )
    const y = Math.round(
      (((e.clientY - top - (state.size.height / 2 - hZoom / 2)) / zoom) *
        imgRes.h) /
        originalH
    )
    return [x, y]
  }

  function onMouseWheel(e) {
    e.preventDefault()
    onZoom(e.wheelDelta ? e.wheelDelta / 40 : e.detail ? -e.detail : 0)
    return false
  }

  function onMouseDown(e) {
    ;[startX, startY] = getXY(e)

    const { selected, oppositeCorner } = selectBox(startX, startY, true)
    const [x, y] = oppositeCorner || []

    if (oppositeCorner) {
      startX = x
      startY = y
    }

    isDown = true
    newBox = !oppositeCorner
    movingBox = oppositeCorner ? undefined : selected
    resizing = oppositeCorner ? selected : undefined
  }

  function onMouseMove(e) {
    e.preventDefault()
    e.stopPropagation()

    const [mouseX, mouseY] = getXY(e)

    setXY([mouseX, mouseY])

    if (!isDown) {
      const { selected, oppositeCorner } = selectBox(mouseX, mouseY)

      if (oppositeCorner) {
        const [w, h] = oppositeCorner
        const [w1, h1, w2, h2] = boxes[selected]
        const left = Math.max(w, w1, w2) === w
        const top = Math.max(h, h1, h2) === h
        const nesw = (top && !left) || (!top && left)
        canvasRef.current.style = `cursor: ${
          nesw ? 'nesw-resize' : 'nwse-resize'
        };`
      } else if (selected > -1) {
        canvasRef.current.style = 'cursor: move;'
      } else {
        canvasRef.current.style = 'cursor: crosshair;'
      }
      return
    }

    const data = [startX, startY, mouseX, mouseY]

    if (startX === mouseX || mouseY === startY) return

    if (movingBox > -1) {
      startX = mouseX
      startY = mouseY
      dispatch({ type: 'move-box', data })
    } else if (newBox) {
      dispatch({ type: 'add-box', data })
      requestAnimationFrame(() => document.querySelector('input[list]').focus())
    } else if (resizing > -1)
      dispatch({ type: 'edit-box', data: { box: data, index: resizing } })
    else
      dispatch({
        type: 'edit-box',
        data: { box: data, index: boxes.length - 1 },
      })
    newBox = false
  }

  function stopDragging(e) {
    e.preventDefault()
    e.stopPropagation()

    isDown = false
    movingBox = undefined
    resizing = undefined
  }

  if (!file) return null

  return (
    <div className={styles.canvasWrapper}>
      <canvas
        width={state.size.width}
        height={state.size.height}
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseOut={stopDragging}
        onMouseUp={stopDragging}
        onMouseWheel={onMouseWheel}
      />
      {xy && <div className={styles.info}>{`X: ${xy[0]} - Y: ${xy[1]}`}</div>}
    </div>
  )
}
