import extractLabelsFromTxtFiles from './extractLabelsFromTxtFiles'
import extractLabelsFromXmlFiles from './extractLabelsFromXmlFiles'

export default async function extractFilesLabels(files) {
  let images = []
  let txts = []
  let txtsContent = []
  let xmls = []
  let xmlsContent = []

  for (let file of files) {
    if (file.type.startsWith('image')) {
      images.push(file)
      continue
    }
    if (file.type === 'text/plain') {
      txts.push(file)
      txtsContent.push(await extractFileContent(file))
      continue
    }
    if (file.type === 'text/xml') {
      xmls.push(file)
      xmlsContent.push(await extractFileContent(file))
    }
  }

  const fromTxt = await extractLabelsFromTxtFiles(images, txts, txtsContent)
  const fromXml = extractLabelsFromXmlFiles(images, xmls, xmlsContent)

  return {
    images,
    allBoxes: { ...fromTxt.boxes, ...fromXml.boxes },
    allBoxesNames: { ...fromTxt.boxesNames, ...fromXml.boxesNames },
  }
}

export async function extractFileContent(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader()

    reader.onload = () => res(reader.result)
    reader.onerror = rej
    reader.readAsText(file)
  })
}
