import getImagesResolutions from './getImagesResolutions'
import fixers from './fixers'

export default async function extractLabelsFromTxtFiles(
  images,
  txts,
  txtsContent
) {
  const hasBoxes = (b) =>
    b.match(/^(\d (\d|\.| |\n)*)/g) && b.split('\n')?.[0]?.length > 36
  const boxes = {}
  const boxesNames = {}
  const classes = txtsContent.find((data) => !hasBoxes(data))

  if (!classes) return { boxes, boxesNames }

  const labels = classes.split('\n').map((t) => t.trim())
  const indexes = txts.reduce((o, im, i) => {
    o[im.name.split('.')[0]] = i
    return o
  }, {})

  for (let imgIndx = 0; imgIndx < images.length; imgIndx += 1) {
    const image = images[imgIndx]
    const name = image.name.split('.')[0]
    const i = indexes[name]

    if (i === undefined) continue

    const coordinates = txtsContent[i].split('\n')
    const [{ w, h }] = await getImagesResolutions([image])
    const { unfixW, unfixH } = fixers({ w, h })

    boxes[imgIndx] = coordinates.map((c) => {
      const [, bx, by, bw, bh] = c.trim().split(' ').map(parseFloat)
      return [
        unfixW((bx - bw / 2) * w),
        unfixH((by - bh / 2) * h),
        unfixW((bw - bw / 2) * w),
        unfixH((bh - by / 2) * h),
      ]
    })

    boxesNames[imgIndx] = coordinates.reduce(
      (o, c, idx) => ({
        [idx]: labels[parseInt(c.trim()[0])],
        ...o,
      }),
      {}
    )
  }

  return { boxes, boxesNames }
}
