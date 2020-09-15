import { useEffect, useRef, useState } from 'react'

import getPointSizeOnCanvas from '../utils/getPointSizeOnCanvas'
import useZoom from './useZoom'
import { useDashboard } from '.'

const cornerSize = 5

/**
 * Check if the point { x, y } is inside a box [bx, by, bx2, by2]
 *
 * @param {number} x - point X to check
 * @param {number} y - point Y to check
 * @param {number} bx - startX of Box
 * @param {number} by - startY of Box
 * @param {number} bx2  - endX of Box
 * @param {number} by2 - endY of Box
 * @param {number} pad - Padding
 */
function isInside(x, y, bx, by, bx2, by2, pad = 0) {
  return (
    Math.min(bx - pad, bx2 + pad, x) !== x &&
    Math.max(bx - pad, bx2 + pad, x) !== x &&
    Math.min(by - pad, by2 + pad, y) !== y &&
    Math.max(by - pad, by2 + pad, y) !== y
  )
}

function arc(ctx, x, y) {
  ctx.beginPath()
  ctx.arc(x, y, cornerSize, 0, 2 * Math.PI)
  ctx.closePath()
  ctx.fill()
}

export default function useRedraw() {
  const { boxes, state, imgRef, canvasRef, ctxRef } = useDashboard()

  function redraw() {
    const img = imgRef.current
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    const ratio = img.width / img.height
    let width = canvas.width
    let height = width / ratio

    if (height > canvas.height) {
      height = canvas.height
      width = height * ratio
    }

    // Clear canvas
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.restore()

    // Draw
    ctx.drawImage(
      img,
      canvas.width / 2 - width / 2,
      canvas.height / 2 - height / 2,
      width,
      height
    )

    // Boxes
    boxes.forEach(([startX, startY, mouseX, mouseY], index) => {
      const imgSize = { w: img.width, h: img.height }
      const [x, y] = getPointSizeOnCanvas(startX, startY, imgSize, state.size)
      const [mx, my] = getPointSizeOnCanvas(mouseX, mouseY, imgSize, state.size)

      const color = index === state.selectedBox ? '#64b5f6' : '#aed581'
      ctx.beginPath()
      ctx.fillStyle = color + '44' //opacity
      ctx.lineWidth = 2
      ctx.fillRect(x, y, mx - x, my - y)
      ctx.fillStyle = color
      arc(ctx, x, y)
      arc(ctx, x + (mx - x), y)
      arc(ctx, x, y + (my - y))
      arc(ctx, mx, my)
    })
  }

  return redraw
}

export function useLoadImage() {
  const { state, boxes, imgRef, canvasRef, ctxRef, dispatch } = useDashboard()
  const redraw = useRedraw()
  const onZoom = useZoom()
  const oldIndex = useRef()
  const [imgRes, setImgRes] = useState()
  const file = state.files[state.fileIndex]

  useEffect(() => {
    let img

    if (!file) return

    const handler = () => {
      if (img) setImgRes({ w: img.width, h: img.height })
      onZoom(-state.zoom)
      dispatch({
        type: 'set-size',
        data: {
          width: window.innerWidth - 420,
          height: window.innerHeight,
        },
      })
      requestAnimationFrame(redraw)
    }

    if (oldIndex.current !== state.fileIndex) {
      img = new Image()
      img.src = URL.createObjectURL(file)
      img.onload = handler
      imgRef.current = img
      ctxRef.current = canvasRef.current.getContext('2d')
    }

    oldIndex.current = state.fileIndex
    window.addEventListener('resize', handler)

    return () => {
      if (img) URL.revokeObjectURL(img.src)
      window.removeEventListener('resize', handler)
    }
  }, [file, state])

  useEffect(() => {
    if (!file || !boxes || boxes.length === 0) return
    redraw()
  }, [file, boxes])

  return imgRes
}

export function useSelectBox() {
  const { boxes, dispatch, canvasRef } = useDashboard()
  const redraw = useRedraw()
  const needsRedraw = useRef(false)

  /**
   * This function calculates if there where we are clicking corresponds to
   * a box. In addition, if where we click is one of the points to resize,
   * we return the opposite corner, this is useful to define the opposite
   * corner as the origin and where we are clicking as the end, so we can then
   * resize the rectangles.
   */
  function selectBox(e, autoselect = false) {
    const { left, top } = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - left
    const y = e.clientY - top
    let selected, oppositeCorner
    const padding = cornerSize + 2 / 2

    for (let i = 0; i < boxes.length; i += 1) {
      const [startX, startY, mouseX, mouseY] = boxes[i]
      let c

      if (isInside(x, y, startX, startY, startX, startY, padding)) {
        c = oppositeCorner = [mouseX, mouseY]
      }
      if (
        isInside(
          x,
          y,
          startX + (mouseX - startX),
          startY,
          startX + (mouseX - startX),
          startY,
          padding
        )
      ) {
        c = oppositeCorner = [startX, startY + (mouseY - startY)]
      }
      if (
        isInside(
          x,
          y,
          startX,
          startY + (mouseY - startY),
          startX,
          startY + (mouseY - startY),
          padding
        )
      ) {
        c = oppositeCorner = [startX + (mouseX - startX), startY]
      }
      if (isInside(x, y, mouseX, mouseY, mouseX, mouseY, padding)) {
        c = oppositeCorner = [startX, startY]
      }
      if (c || isInside(x, y, startX, startY, mouseX, mouseY)) {
        selected = i
      }
    }

    if (autoselect && selected !== undefined) {
      needsRedraw.current = true
      dispatch({ type: 'select-box', data: selected })
    }

    return { selected, oppositeCorner }
  }

  useEffect(() => {
    if (!needsRedraw.current) return
    redraw()
    needsRedraw.current = false
  })

  return selectBox
}
