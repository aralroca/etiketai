import getPascalVocLabels from "../getPascalVocLabels"

describe('getPascalVocLabels', () => {
  test('it works', () => {
    const input = ''
    const output = getPascalVocLabels(input)
    const expected = 'pascal'

    expect(output).toBe(expected)
  })
})
