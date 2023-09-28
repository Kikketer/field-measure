import { convertToFeet } from './convertToFeet'

describe('convertToFeet', () => {
  it('should convert 0.5 to 6"', () => {
    expect(convertToFeet(0.5)).toBe('0\' 6"')
  })

  it('should convert 12.5 to 12\' 6"', () => {
    expect(convertToFeet(12.5)).toBe('12\' 6"')
  })

  it("should convert 12.99 to 13'", () => {
    expect(convertToFeet(12.99)).toBe("13'")
  })
})
