import chunk from './chunk'

const labelNameRgx = /<name>([^<]*)<\//g
const coordsRgx = /<(xmax|xmin|ymax|ymin)>([^<]*)<\//g

export default function extractLabelsFromXmlFiles(
  images,
  xmls,
  xmlsContent,
  startIndex = 0
) {
  const boxes = {}
  const boxesNames = {}
  let currentIndex = startIndex

  const indexes = xmls.reduce((o, im, i) => {
    o[im.name.split('.')[0]] = i
    return o
  }, {})

  for (let imgIndx = 0; imgIndx < images.length; imgIndx += 1) {
    const image = images[imgIndx]
    const name = image.name.split('.')[0]
    const i = indexes[name]

    if (i === undefined) continue

    const coordinates = (xmlsContent[i].match(coordsRgx) || []).map((c) =>
      parseInt(c.replace(/[^\d]*/g, ''))
    )

    currentIndex = imgIndx + startIndex
    boxes[currentIndex] = chunk(coordinates, 4)
    boxesNames[currentIndex] = (
      xmlsContent[i].match(labelNameRgx) || []
    ).reduce((o, c, indx) => {
      o[indx] = c.replace('<name>', '').replace('</', '')
      return o
    }, {})
  }

  return {
    boxes,
    boxesNames,
    lastIndex: currentIndex,
  }
}
