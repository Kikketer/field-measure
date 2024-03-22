import { getDateFromPartialDate } from './getDateFromPartialDate'

describe('setTimeOnDate', () => {
  it('returns a Date object with current time when given a date string', () => {
    const dateWithoutTime = '2022-01-01'
    const result = getDateFromPartialDate(dateWithoutTime)
    expect(result).toBeInstanceOf(Date)
    expect(result?.toISOString().startsWith(dateWithoutTime)).toBe(true)
  })

  it('returns a Date object with current time when given a date string with time', () => {
    const dateWithTime = '2022-01-01T12:34:56'
    const result = getDateFromPartialDate(dateWithTime)
    expect(result).toBeInstanceOf(Date)
    expect(result?.toISOString().startsWith('2022-01-01')).toBe(true)
  })

  it('throws an error when given an invalid date string', () => {
    const invalidDate = 'invalid-date'
    expect(() => getDateFromPartialDate(invalidDate)).toThrow()
  })

  it('should return undefined if given undefined ', () => {
    expect(getDateFromPartialDate(undefined)).toBeUndefined()
  })
})
