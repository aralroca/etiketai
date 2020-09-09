import getYoloLabels from "../getYoloLabels"

describe('getYoloLabels', () => {
  test('it works', () => {
    const input = ''
    const output = getYoloLabels(input)
    const expected = 'yolo'

    expect(output).toBe(expected)
  })
})
