import getImgSizeOnCanvas from './getImgSizeOnCanvas'

export default function getPointSizeOnCanvas(x, y, imgSize, canvasSize) {
  const [originalW, originalH] = getImgSizeOnCanvas(imgSize, canvasSize)

  return [
    Math.round(
      (x * originalW) / imgSize.w + canvasSize.width / 2 - originalW / 2
    ),
    Math.round(
      (y * originalH) / imgSize.h + canvasSize.height / 2 - originalH / 2
    ),
  ]
}
