import extractLabelsFromTxtFiles from '../extractLabelsFromTxtFiles'
import extractLabelsFromXmlFiles from '../extractLabelsFromXmlFiles'
import getPascalVocLabels from '../getPascalVocLabels'
import getYoloLabels from '../getYoloLabels'

jest.mock('../getImagesResolutions', () => () => {
  return [{ w: 960, h: 432 }]
})

jest.mock('../getCanvasSize', () => () => {
  return {
    width: 703,
    height: 957,
  }
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
]

describe('labels', () => {
  describe('Getting files labels from state', () => {
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

  describe('Getting state labels from files', () => {
    let expectedBoxes, expectedBoxNames, inputXml, inputTxt

    beforeAll(() => {
      const images = [{ name: 'test.jpg' }, { name: 'another.jpg' }]
      expectedBoxes = {
        0: [
          [253, 296, 334, 438],
          [464, 243, 542, 381],
          [641, 254, 720, 412],
          [784, 225, 883, 384],
          [352, 26, 425, 113],
        ],
      }
      expectedBoxNames = {
        0: { 0: 'Horse', 1: 'Horse', 2: 'Horse', 3: 'Horse', 4: 'Head' },
      }
      inputXml = [
        images,
        [{ name: 'test.xml' }],
        [
          '<annotation><filename>test.jpg</filename><source><database>Unknown</database></source><size><width>960</width><height>432</height><depth>3</depth></size><segmented>0</segmented><object><name>Horse</name><pose>Unspecified</pose><truncated>0</truncated><difficult>0</difficult><bndbox><xmin>253</xmin><ymin>272</ymin><xmax>334</xmax><ymax>414</ymax></bndbox></object><object><name>Horse</name><pose>Unspecified</pose><truncated>0</truncated><difficult>0</difficult><bndbox><xmin>464</xmin><ymin>219</ymin><xmax>542</xmax><ymax>356</ymax></bndbox></object><object><name>Horse</name><pose>Unspecified</pose><truncated>0</truncated><difficult>0</difficult><bndbox><xmin>641</xmin><ymin>230</ymin><xmax>720</xmax><ymax>388</ymax></bndbox></object><object><name>Horse</name><pose>Unspecified</pose><truncated>0</truncated><difficult>0</difficult><bndbox><xmin>784</xmin><ymin>201</ymin><xmax>883</xmax><ymax>359</ymax></bndbox></object><object><name>Head</name><pose>Unspecified</pose><truncated>0</truncated><difficult>0</difficult><bndbox><xmin>425</xmin><ymin>88</ymin><xmax>352</xmax><ymax>2</ymax></bndbox></object></annotation>',
        ],
      ]
      inputTxt = [
        images,
        [{ name: 'test.txt' }, { name: 'classes.txt' }],
        [
          '0 0.305729 0.849537 0.084375 0.328704\n0 0.523958 0.722222 0.081250 0.319444\n0 0.708854 0.770833 0.082292 0.365741\n0 0.868229 0.704861 0.103125 0.368056\n1 0.404688 0.160880 0.076042 0.201389',
          'Horse\nHead',
        ],
      ]
    })

    test('extractLabelsFromTxtFiles should return a list of boxes and boxesNames', async () => {
      const { boxes, boxesNames } = await extractLabelsFromTxtFiles(...inputTxt)
      expect(boxesNames).toStrictEqual(expectedBoxNames)
      expect(boxes).toStrictEqual(expectedBoxes)
    })

    test('extractLabelsFromXmlFiles should return a list of boxes and boxesNames', async () => {
      const { boxes, boxesNames } = extractLabelsFromXmlFiles(...inputXml)
      expect(boxes).toStrictEqual(expectedBoxes)
      expect(boxesNames).toStrictEqual(expectedBoxNames)
    })

    test('extractLabelsFromTxtFiles should return void when classes.txt are not', async () => {
      inputTxt[1] = [inputTxt[1][0]]
      inputTxt[2] = [inputTxt[2][0]]
      const { boxes, boxesNames } = await extractLabelsFromTxtFiles(...inputTxt)
      expect(boxes).toStrictEqual({})
      expect(boxesNames).toStrictEqual({})
    })
  })
})
