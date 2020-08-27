import { useEffect, useRef } from 'react'
import { useDashboard } from '.'

function arc(ctx, x, y) {
  ctx.beginPath()
  ctx.arc(x, y, 5, 0, 2 * Math.PI)
  ctx.closePath()
  ctx.fill()
}

export default function useRedraw() {
  const { state, imgRef, canvasRef, ctxRef } = useDashboard()

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
    ctx.drawImage(img, 0, 0, width, height)
    URL.revokeObjectURL(img.src)

    // Boxes
    if (!state.boxes) return
    state.boxes.forEach(([startX, startY, mouseX, mouseY], index) => {
      const color = index === state.selectedBox ? '#64b5f6' : '#aed581'
      ctx.beginPath()
      ctx.fillStyle = color + '44' //opacity
      ctx.lineWidth = 2
      ctx.fillRect(startX, startY, mouseX - startX, mouseY - startY)
      ctx.fillStyle = color
      arc(ctx, startX, startY)
      arc(ctx, startX + (mouseX - startX), startY)
      arc(ctx, startX, startY + (mouseY - startY))
      arc(ctx, mouseX, mouseY)
    })
  }

  return redraw
}

export function useRedrawOnChangeFile() {
  const { state, imgRef, canvasRef, ctxRef, dispatch } = useDashboard()
  const redraw = useRedraw()
  const file = state.files[state.fileIndex]

  useEffect(() => {
    if (!file) return

    const handler = () => {
      dispatch({ type: 'reset-zoom' })
      dispatch({
        type: 'set-size',
        data: {
          width: window.innerWidth - 420,
          height: window.innerHeight,
        },
      })
      redraw()
    }

    const context = canvasRef.current.getContext('2d')
    const img = new Image()

    img.src = URL.createObjectURL(file)
    img.onload = handler
    imgRef.current = img
    ctxRef.current = context

    window.addEventListener('resize', handler)

    return () => window.removeEventListener('resize', handler)
  }, [file])

  useEffect(() => {
    if (!file || !state.boxes || state.boxes.length === 0) return
    redraw()
  }, [file, state.boxes])
}

export function useRedrawOnResize() {
  const { state, imgRef } = useDashboard()
  const redraw = useRedraw()

  useEffect(() => {
    if (!imgRef.current) return
    redraw()
  }, [state.size.width])
}

export function useSelectBoxOnClick() {
  const { state, dispatch, canvasRef } = useDashboard()
  const redraw = useRedraw()
  const needsRedraw = useRef(false)

  function onClick(e) {
    const { left, top } = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - left
    const y = e.clientY - top
    const boxes = state.boxes || []
    let selected

    boxes.forEach(([startX, startY, mouseX, mouseY], index) => {
      if (
        Math.min(startX, mouseX, x) !== x &&
        Math.max(startX, mouseX, x) !== x &&
        Math.min(startY, mouseY, y) !== y &&
        Math.max(startY, mouseY, y) !== y
      ) {
        selected = index
      }
    })

    if (selected !== undefined) {
      needsRedraw.current = true
      dispatch({ type: 'select-box', data: selected })
    }
  }

  useEffect(() => {
    if (!needsRedraw.current) return
    redraw()
    needsRedraw.current = false
  })

  return onClick
}