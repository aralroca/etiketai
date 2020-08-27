import {
  useRedrawOnChangeFile,
  useRedrawOnResize,
  useSelectBoxOnClick,
} from '../../context/useRedraw'
import useKeyDownControls from '../../context/useKeyDownControls'
import useZoom from '../../context/useZoom'
import { useDashboard } from '../../context'

let startX
let startY
let isDown
let newBox

export default function Center() {
  const { state, canvasRef, dispatch } = useDashboard()
  const onZoom = useZoom()
  const file = state.files[state.fileIndex]
  const onClick = useSelectBoxOnClick()

  useRedrawOnChangeFile()
  useRedrawOnResize()
  useKeyDownControls()

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
    newBox = true
  }

  function onMouseMove(e) {
    e.preventDefault()
    e.stopPropagation()

    if (!isDown) return

    const { left, top } = canvasRef.current.getBoundingClientRect()
    const mouseX = parseInt(e.clientX - left)
    const mouseY = parseInt(e.clientY - top)
    const data = [startX, startY, mouseX, mouseY]

    if (startX === mouseX || mouseY === startY) return
    if (newBox) dispatch({ type: 'add-box', data })
    else dispatch({ type: 'edit-last-box', data })
    newBox = false
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
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseOut={stopDragging}
      onMouseUp={stopDragging}
      onMouseWheel={onMouseWheel}
    />
  )
}
