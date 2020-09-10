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
      'data:text/xml,<annotation><filename>test.jpg</filename><source><database>Unknown</database></source><size><width>960</width><height>432</height><depth>3</depth></size><segmented>0</segmented><object><name>horse</name><pose>Unspecified</pose><truncated>0</truncated><difficult>0</difficult><bndbox><xmin>249</xmin><ymin>281</ymin><xmax>323</xmax><ymax>399</ymax></bndbox></object><object><name>horse</name><pose>Unspecified</pose><truncated>0</truncated><difficult>0</difficult><bndbox><xmin>441</xmin><ymin>221</ymin><xmax>559</xmax><ymax>349</ymax></bndbox></object><object><name>horse</name><pose>Unspecified</pose><truncated>0</truncated><difficult>0</difficult><bndbox><xmin>637</xmin><ymin>235</ymin><xmax>712</xmax><ymax>378</ymax></bndbox></object><object><name>horse</name><pose>Unspecified</pose><truncated>0</truncated><difficult>0</difficult><bndbox><xmin>790</xmin><ymin>220</ymin><xmax>904</xmax><ymax>366</ymax></bndbox></object><object><name>human</name><pose>Unspecified</pose><truncated>0</truncated><difficult>0</difficult><bndbox><xmin>416</xmin><ymin>94</ymin><xmax>353</xmax><ymax>8</ymax></bndbox></object></annotation>'
    )
  })

  test('getYoloLabels should return a list of text/xml with the correct data', async () => {
    const res = await getYoloLabels(...input)

    expect(res.length).toBe(2)

    expect(res[0].filename).toBe('classes.txt')
    expect(res[0].dataurl).toBe('human\nhorse')

    expect(res[1].filename).toBe('test.txt')
    expect(res[1].dataurl).toBe(
      'data:text/txt,1 0.297917 0.787037 0.077083 0.273148\n1 0.520833 0.659722 0.122917 0.296296\n1 0.702604 0.709491 0.078125 0.331019\n1 0.882292 0.678241 0.118750 0.337963\n2 0.400521 0.118056 0.065625 0.199074'
    )
  })
})
