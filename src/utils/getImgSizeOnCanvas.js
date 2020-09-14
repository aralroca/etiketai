export default function getImgSizeOnCanvas(imgSize, canvasSize, zoom) {
  const { w, h } = imgSize || {}
  const horizontal = w > h
  let originalW = horizontal
    ? Math.round(canvasSize.width)
    : Math.round((w * canvasSize.height) / h)

  const originalH = horizontal
    ? Math.round((canvasSize.width * h) / w)
    : Math.round(canvasSize.height)

  return {
    originalW,
    originalH,
    wZoom: originalW * zoom,
    hZoom: originalH * zoom,
  }
}
