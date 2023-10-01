import {
  adjustRainFactorAndDryDays,
  getPredictedDaysUntilPaint,
} from './calculateConditions'
import { Field } from './types'

const field: Partial<Field> = Object.freeze({
  lastPainted: new Date('2021-01-01'),
  previousRainfallDays: 3,
  // Simply counts days we get more than .5 inches of rain
  rainfallDays: 3,
  // How the rainfall affects the field
  rainfallFactor: 1,
  maxDryDays: 14,
})

describe('Calculate Conditions', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  describe('getPredictedDaysUntilPaint', () => {
    it('should show the proper days until paint based on rainfall days and maxDryDays', () => {
      // 0 days since the last painting
      jest.setSystemTime(new Date('2021-01-01'))
      // 14 dry days - 3 rainfall days
      expect(getPredictedDaysUntilPaint(field as Field)).toBe(11)
    })

    it('should show the proper days until paint and subtract the current date', () => {
      // Similar to the test above but subtract 10 days
      jest.setSystemTime(new Date('2021-01-11'))
      // 14 dry days - 3 rainfall days
      expect(getPredictedDaysUntilPaint(field as Field)).toBe(1)
    })

    it('should factor in the rainfal factor as well', () => {
      // 0 days since the last painting
      jest.setSystemTime(new Date('2021-01-01'))
      // 14 dry days - (3 rainfall days * .5 rain factor)
      const fieldWithRainFactor = { ...field, rainfallFactor: 0.5 }
      // 0 days since last paint, 14 - (3 * 1.5) = 12.5
      expect(getPredictedDaysUntilPaint(fieldWithRainFactor as Field)).toBe(
        12.5,
      )
    })
  })

  describe('adjustRainFactorAndDryDays', () => {
    it('should adjust the max days if there was no rain days between the last time the field was painted and the current date', () => {
      const adjustedField = adjustRainFactorAndDryDays({
        currentField: {
          ...field,
          previousRainfallDays: 3,
          rainfallDays: 0,
        } as Field,
        // This is 10 days since the last painting, so the rainfall factor should be adjusted to make the resulting days equal 10
        markedUnplayableOn: new Date('2021-01-11'),
      })
      // This should look at any previous time periods and adjust the rain factor to account for this new number
      console.log(new Date())
    })

    it('should adjust the rain factor if there was rain days between the last time the field was painted and the current date', () => {
      const adjustedField = adjustRainFactorAndDryDays({
        currentField: field as Field,
        // This is 10 days since the last painting, so the rainfall factor should be adjusted to make the resulting days equal 10
        markedUnplayableOn: new Date('2021-01-11'),
      })
      // 14 max dry days, 3 rainfall days, marked at 10th day = 1.5 rain factor
      // 14 - 3n = 10 = 4/3 = 1.333
      expect(adjustedField.rainfallFactor).toBe(1.3333333333333333)
    })
  })
})
