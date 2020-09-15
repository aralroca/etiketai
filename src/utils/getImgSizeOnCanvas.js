import getCanvasSize from './getCanvasSize'

export default function getImgSizeOnCanvas(imgSize, zoom) {
  const canvasSize = getCanvasSize()
  const { w, h } = imgSize || {}
  const horizontal = w > h
  let originalW = horizontal
    ? Math.round(canvasSize.width)
    : Math.round((w * canvasSize.height) / h)

  const originalH = horizontal
    ? Math.round((canvasSize.width * h) / w)
    : Math.round(canvasSize.height)

  return [originalW, originalH, originalW * zoom, originalH * zoom]
}
