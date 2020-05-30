import useRedraw from './useRedraw'
import { useDashboard } from '.'

const isNode = typeof window === 'undefined'
const MAX_ZOOM = 15

const svg = isNode
  ? undefined
  : document.createElementNS('http://www.w3.org/2000/svg', 'svg')

const svgPoint = isNode ? undefined : svg.createSVGPoint()
const xform = isNode ? undefined : svg.createSVGMatrix()

function transformedPoint(x, y) {
  svgPoint.x = x
  svgPoint.y = y
  return svgPoint.matrixTransform(xform.inverse())
}

export default function useZoom() {
  const { state, canvasRef, dispatch } = useDashboard()
  const redraw = useRedraw()

  function onZoom(delta) {
    const { zoom } = state

    if (!canvasRef.current) return
    if (zoom >= MAX_ZOOM && delta > 0) return
    if (zoom <= -MAX_ZOOM && delta < 0) return

    if (delta) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const pt = transformedPoint(canvas.width / 2, canvas.height / 2)
      ctx.translate(pt.x, pt.y)
      const factor = Math.pow(1.1, delta)
      ctx.scale(factor, factor)
      ctx.translate(-pt.x, -pt.y)
      redraw()
      dispatch({ type: 'set-zoom', data: delta })
    }
  }

  return onZoom
}
