import useRedraw, {
  useRedrawOnChangeFile,
  useRedrawOnResize,
} from '../../context/useRedraw'
import useZoom from '../../context/useZoom'
import { useDashboard } from '../../context'

let startX
let startY
let isDown

export default function Center() {
  const { state, canvasRef, ctxRef } = useDashboard()
  const onZoom = useZoom()
  const redraw = useRedraw()
  const file = state.files[state.fileIndex]

  useRedrawOnChangeFile()
  useRedrawOnResize()

  function onMouseWheel(e) {
    e.preventDefault()
    onZoom(e.wheelDelta ? e.wheelDelta / 40 : e.detail ? -e.detail : 0)
    return false
  }

  function onMouseDown(e) {
    const { left, top } = canvasRef.current.getBoundingClientRect()

    startX = parseInt(e.clientX - left, 10)
    startY = parseInt(e.clientY - top, 10)
    isDown = true
  }

  function arc(ctx, x, y) {
    ctx.beginPath()
    ctx.fillStyle = '#aed581'
    ctx.arc(x, y, 5, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fill()
  }

  function onMouseMove(e) {
    e.preventDefault()
    e.stopPropagation()

    if (!isDown) return

    const { left, top } = canvasRef.current.getBoundingClientRect()
    const ctx = ctxRef.current
    const mouseX = parseInt(e.clientX - left)
    const mouseY = parseInt(e.clientY - top)

    ctx.beginPath()
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    redraw()
    ctx.fillStyle = '#aed58144'
    ctx.lineWidth = 2
    ctx.fillRect(startX, startY, mouseX - startX, mouseY - startY)
    arc(ctx, startX, startY)
    arc(ctx, startX + (mouseX - startX), startY)
    arc(ctx, startX, startY + (mouseY - startY))
    arc(ctx, mouseX, mouseY)
  }

  function stopDragging(e) {
    e.preventDefault()
    e.stopPropagation()

    isDown = false
  }

  if (!file) return null

  return (
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
  )
}
