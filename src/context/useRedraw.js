import { useDashboard } from '.'
import { useEffect } from 'react'

export default function useRedraw() {
  const { imgRef, canvasRef, ctxRef } = useDashboard()

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
}

export function useRedrawOnResize() {
  const { state, imgRef } = useDashboard()
  const redraw = useRedraw()

  useEffect(() => {
    if (!imgRef.current) return
    redraw()
  }, [state.size.width])
}
