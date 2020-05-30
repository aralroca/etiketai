import { useDashboard } from '.'
import useRedraw from './useRedraw'

const MAX_ZOOM = 15
const isNode = typeof window === 'undefined'

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
  const { canvasRef, zoom } = useDashboard()
  const redraw = useRedraw()

  function onZoom(delta) {
    if (zoom.current >= MAX_ZOOM && delta > 0) return
    if (zoom.current <= -MAX_ZOOM && delta < 0) return

    if (delta) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const pt = transformedPoint(canvas.width / 2, canvas.height / 2)
      ctx.translate(pt.x, pt.y)
      const factor = Math.pow(1.1, delta)
      zoom.current += delta
      ctx.scale(factor, factor)
      ctx.translate(-pt.x, -pt.y)
      redraw()
    }
  }

  return onZoom
}
