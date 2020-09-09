import getImagesResolutions from './getImagesResolutions'

function xml(boxes, file, boxNames, { w, h }, canvasSize) {
  const horizontal = w > h
  let realW = horizontal
    ? parseInt(canvasSize.width, 10)
    : parseInt((w * canvasSize.height) / h, 10)

  const realH = horizontal
    ? parseInt((canvasSize.width * h) / w, 10)
    : parseInt(canvasSize.height, 10)

  const fixW = x => parseInt((x * w) / realW, 10)
  const fixH = y => parseInt((y * h) / realH, 10)

  return `<annotation>
  <filename>${file.name}</filename>
  <source>
		<database>Unknown</database>
	</source>
  <size>
    <width>${w}</width>
    <height>${h}</height>
    <depth>3</depth>
  </size>
  <segmented>0</segmented>
  ${boxes.map(([x, y, mx, my], index) => `
    <object>
      <name>${boxNames?.[index]}</name>
      <pose>Unspecified</pose>
      <truncated>0</truncated>
      <difficult>0</difficult>
      <bndbox>
        <xmin>${fixW(x)}</xmin>
        <ymin>${fixH(y)}</ymin>
        <xmax>${fixW(mx)}</xmax>
        <ymax>${fixH(my)}</ymax>
      </bndbox>
    </object>
  `).join('\n')}
</annotation>`
}

export default async function getPascalVocLabels(allBoxes, files, labels, size) {
  const resolutions = await getImagesResolutions(files)

  return allBoxes.map((boxes, i) => ({
    dataurl: `data:text/xml,${xml(boxes, files[i], labels[i], resolutions[i], size)}`,
    filename: files[i].name.split('.')[0] + '.xml',
  }))
}
