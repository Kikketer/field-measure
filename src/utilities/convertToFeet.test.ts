import { convertToFeet } from './convertToFeet'

describe('convertToFeet', () => {
  it('should convert 0.5 to 6"', () => {
    expect(convertToFeet(0.5)).toBe('0\' 6"')
  })
})
