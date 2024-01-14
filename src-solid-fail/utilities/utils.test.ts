import { getStartOfDate } from './utils'

describe('utils', () => {
  describe('getStartOfDate', () => {
    it('should return the start of the date if provided a string', () => {
      const date = '2023-10-08T00:20:00.000Z'
      console.log(getStartOfDate(date))
      // expect().toEqual(new Date('2023-10-08T00:00.000Z'))
    })
  })
})
