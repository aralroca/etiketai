import getImagesResolutions from './getImagesResolutions'

/**
 * format: <object-class> <x> <y> <width> <height>.
 *
 * - <object-class> - integer number of object from 0 to (classes-1)
 * - <x> <y> <width> <height> - float values relative to width and height
 * of image, it can be equal from (0.0 to 1.0]
 * - for example: <x> = <absolute_x> / <image_width> or
 * <height> = <absolute_height> / <image_height>
 * - atention: <x> <y> - are center of rectangle (are not top-left corner)
 */
function coords(box, { w, h }) {
  const [b1, b2, b3, b4] = box
  const round6 = (n) => (Math.round(n * 1000000) / 1000000).toFixed(6)
  const x = round6((b1 + b3) / 2 / w)
  const y = round6((b2 + b4) / 2 / h)
  const width = round6(Math.abs(b1 - b3) / w)
  const height = round6(Math.abs(b2 - b4) / h)

  return `${x} ${y} ${width} ${height}`
}

function txt(boxes, labelsIndx, labels, imgRes, canvasSize) {
  return boxes
    .map(
      (box, index) =>
        `${labelsIndx[labels[index]]} ${coords(box, imgRes, canvasSize)}`
    )
    .join('\n')
}

export default async function getYoloLabels(allBoxes, files, labels) {
  const resolutions = await getImagesResolutions(files)
  const labelsArr = [...new Set(labels.flatMap((b) => Object.values(b)))]
  const labelsIndx = labelsArr.reduce((o, c, i) => ({ ...o, [c]: i }), {})

  return [
    {
      dataurl: `data:text/txt,${labelsArr.join('\n')}`,
      filename: 'classes.txt',
    },
    ...allBoxes.map((boxes, i) => ({
      dataurl: `data:text/txt,${txt(
        boxes,
        labelsIndx,
        labels[i],
        resolutions[i]
      )}`,
      filename: files[i].name.split('.')[0] + '.txt',
    })),
  ]
}
