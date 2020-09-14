export default function fixers({ w, h } = {}, canvasSize = {}) {
  const horizontal = w > h
  let realW = horizontal
    ? Math.round(canvasSize.width)
    : Math.round((w * canvasSize.height) / h)

  const realH = horizontal
    ? Math.round((canvasSize.width * h) / w)
    : Math.round(canvasSize.height)

  const fixW = (x) =>
    parseInt((x * w) / realW + realW / 2 - canvasSize.width / 2, 10)
  const fixH = (y) =>
    parseInt((y * h) / realH + realH / 2 - canvasSize.height / 2, 10)

  return { fixW, fixH, realW, realH }
}
