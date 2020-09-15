import getImgSizeOnCanvas from '../getImgSizeOnCanvas'
import getPointSizeOnCanvas from '../getPointSizeOnCanvas'

jest.mock('../getCanvasSize', () => () => {
  return {
    width: 1127,
    height: 978,
  }
})

describe('Resolution', () => {
  describe('getImgSizeOnCanvas', () => {
    test('getImgSizeOnCanvas should work without zoom ', () => {
      const input = [{ w: 960, h: 432 }]
      const output = getImgSizeOnCanvas(...input)
      const expected = [1127, 507, 1127, 507]
      expect(output).toStrictEqual(expected)
    })
    test('getImgSizeOnCanvas should work with zoom in', () => {
      const input = [{ w: 960, h: 432 }, 0.6194435812326758]
      const output = getImgSizeOnCanvas(...input)
      const expected = [1127, 507, 698.1129160492256, 314.05789568496664]
      expect(output).toStrictEqual(expected)
    })

    test('getImgSizeOnCanvas should work with zoom out', () => {
      const input = [{ w: 960, h: 432 }, 1.59143659400296]
      const output = getImgSizeOnCanvas(...input)
      const expected = [1127, 507, 1793.549041441336, 806.8583531595007]
      expect(output).toStrictEqual(expected)
    })
  })

  describe('getPointSizeOnCanvas', () => {
    test('getPointSizeOnCanvas should convert an image point to canvas point', () => {
      const input = [877, 364, { w: 960, h: 432 }]
      const output = getPointSizeOnCanvas(...input)
      const expected = [1030, 663]
      expect(output).toStrictEqual(expected)
    })
  })
})
