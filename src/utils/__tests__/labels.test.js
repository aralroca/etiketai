import getPascalVocLabels from '../getPascalVocLabels'
import getYoloLabels from '../getYoloLabels'

jest.mock('../getImagesResolutions', () => () => {
  return [{ w: 960, h: 432 }]
})

const input = [
  [
    [
      [183, 206, 237, 292],
      [323, 162, 410, 256],
      [467, 172, 522, 277],
      [579, 161, 662, 268],
      [305, 69, 259, 6],
    ],
  ],
  [{ name: 'test.jpg' }],
  [
    {
      0: 'horse',
      1: 'horse',
      2: 'horse',
      3: 'horse',
      4: 'human',
    },
  ],
  {
    width: 703,
    height: 957,
  },
]

describe('Getting labels', () => {
  test('getPascalVocLabels should return a list of text/xml with the correct data', async () => {
    const res = await getPascalVocLabels(...input)
    const { dataurl, filename } = res[0]

    expect(res.length).toBe(1)
    expect(filename).toBe('test.xml')
    expect(dataurl).toBe(
      'data:text/xml,<annotation><filename>test.jpg</filename><source><database>Unknown</database></source><size><width>960</width><height>432</height><depth>3</depth></size><segmented>0</segmented><object><name>horse</name><pose>Unspecified</pose><truncated>0</truncated><difficult>0</difficult><bndbox><xmin>183</xmin><ymin>206</ymin><xmax>237</xmax><ymax>292</ymax></bndbox></object><object><name>horse</name><pose>Unspecified</pose><truncated>0</truncated><difficult>0</difficult><bndbox><xmin>323</xmin><ymin>162</ymin><xmax>410</xmax><ymax>256</ymax></bndbox></object><object><name>horse</name><pose>Unspecified</pose><truncated>0</truncated><difficult>0</difficult><bndbox><xmin>467</xmin><ymin>172</ymin><xmax>522</xmax><ymax>277</ymax></bndbox></object><object><name>horse</name><pose>Unspecified</pose><truncated>0</truncated><difficult>0</difficult><bndbox><xmin>579</xmin><ymin>161</ymin><xmax>662</xmax><ymax>268</ymax></bndbox></object><object><name>human</name><pose>Unspecified</pose><truncated>0</truncated><difficult>0</difficult><bndbox><xmin>305</xmin><ymin>69</ymin><xmax>259</xmax><ymax>6</ymax></bndbox></object></annotation>'
    )
  })

  test('getYoloLabels should return a list of text/xml with the correct data', async () => {
    const res = await getYoloLabels(...input)

    expect(res.length).toBe(2)

    expect(res[0].filename).toBe('classes.txt')
    expect(res[0].dataurl).toBe('data:text/txt,horse\nhuman')

    expect(res[1].filename).toBe('test.txt')
    expect(res[1].dataurl).toBe(
      'data:text/txt,0 0.218750 0.576389 0.056250 0.199074\n0 0.381771 0.483796 0.090625 0.217593\n0 0.515104 0.519676 0.057292 0.243056\n0 0.646354 0.496528 0.086458 0.247685\n1 0.293750 0.086806 0.047917 0.145833'
    )
  })
})
