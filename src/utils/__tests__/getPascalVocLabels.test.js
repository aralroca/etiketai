import getPascalVocLabels from "../getPascalVocLabels"

jest.mock('../getImagesResolutions', () => () => {
  return [{ w: 960, h: 432 }]
})

describe('getPascalVocLabels', () => {
  test('should work', async () => {
    const files = [{ name: 'test.jpg' }]
    const size = { width: 703, height: 957 }

    const labels = [
      {
        "0": "horse",
        "1": "horse",
        "2": "horse",
        "3": "horse"
      }
    ]

    const boxes = [[
      [
        180,
        203,
        252,
        303
      ],
      [
        395,
        251,
        334,
        153
      ]
    ]]

    const res = await getPascalVocLabels(boxes, files, labels, size)
    const { dataurl, filename } = res[0]

    expect(labels.length).toBe(1)
    expect(filename).toBe('test.xml')
    expect(dataurl).toBe('data:text/xml,<annotation><filename>test.jpg</filename><source><database>Unknown</database></source><size><width>960</width><height>432</height><depth>3</depth></size><segmented>0</segmented><object><name>horse</name><pose>Unspecified</pose><truncated>0</truncated><difficult>0</difficult><bndbox><xmin>245</xmin><ymin>277</ymin><xmax>344</xmax><ymax>414</ymax></bndbox></object><object><name>horse</name><pose>Unspecified</pose><truncated>0</truncated><difficult>0</difficult><bndbox><xmin>539</xmin><ymin>343</ymin><xmax>456</xmax><ymax>209</ymax></bndbox></object></annotation>')
  })
})
