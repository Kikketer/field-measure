import {
  getFieldWithAdjustedRainFactorAndDryDays,
  getPredictedDaysUntilPaint,
} from './predictNextPainting'

describe('Calculate Conditions', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2023-10-01'))
  })

  describe('Get Predicted Days Until Paint', () => {
    test('get predicted number of days based on simple rainfall days and factor', () => {
      const maxDryDays = 14
      const rainfallDays = 0
      const rainfallFactor = 1
      const lastPainted = new Date('2023-10-01')
      // Expect the next predicted date to be 14 days ahead of today
      const expectedPredictedDate = 14

      const result = getPredictedDaysUntilPaint({
        rainfallDays,
        rainfallFactor,
        maxDryDays,
        lastPainted,
      })

      expect(result).toEqual(expectedPredictedDate)
    })

    test('get predicted days based on complex rainfall and factor', () => {
      const maxDryDays = 14
      const rainfallDays = 4
      const rainfallFactor = 0.3
      const lastPainted = new Date('2023-10-01')
      // Expect the next predicted date to be 12.8 days = 14 - (4 * 0.3)
      const expectedPredictedDate = 12.8

      const result = getPredictedDaysUntilPaint({
        rainfallDays,
        rainfallFactor,
        maxDryDays,
        lastPainted,
      })

      expect(result).toEqual(expectedPredictedDate)
    })
  })

  describe('Adjust rainfall factor', () => {
    test('should adjust rainfall factor if there is a previous rainfall and no rainfall this period', () => {
      const maxDryDays = 14
      const previousRainfallDays = 5
      const rainfallDays = 0
      const rainfallFactor = 1
      const lastPainted = new Date('2023-10-01')

      const resultingField = getFieldWithAdjustedRainFactorAndDryDays({
        currentField: {
          maxDryDays,
          previousRainfallDays,
          rainfallDays,
          rainfallFactor,
          lastPainted,
        },
        markUnplayableOn: new Date('2023-10-13'),
      })

      expect(resultingField.rainfallFactor).toEqual(0.6)
    })

    test('should reset rainfall factor if the dry period was shorter than the rainfall version', () => {
      // If the previous period had rainfall and this current period did not
      // it would make sense that this period should last longer!
      // If this period (dry) was shorter than the previous (with rainfall), then something is amiss
      // like the rainfall had no effect? maybe?
      // In this case we need to set the rainfall factor to 0 since it seems rainfall has no effect
      // Maybe in the next round it'll correct itself
      const maxDryDays = 14
      const previousRainfallDays = 5
      const rainfallDays = 0
      const rainfallFactor = 1
      const lastPainted = new Date('2023-10-01')

      const resultingField = getFieldWithAdjustedRainFactorAndDryDays({
        currentField: {
          maxDryDays,
          previousRainfallDays,
          rainfallDays,
          rainfallFactor,
          lastPainted,
        },
        // Marking it unplayable at 8 days (previous prediction was 9)
        markUnplayableOn: new Date('2023-10-09'),
      })

      expect(resultingField.rainfallFactor).toEqual(0)
    })

    test('should adjust maxDryDays if there is no previous period and no rain this period', () => {
      const maxDryDays = 14
      const rainfallDays = 0
      const rainfallFactor = 1
      const lastPainted = new Date('2023-10-01')

      const resultingField = getFieldWithAdjustedRainFactorAndDryDays({
        currentField: {
          maxDryDays,
          rainfallDays,
          rainfallFactor,
          lastPainted,
        },
        // Marking it unplayable at 10 days
        markUnplayableOn: new Date('2023-10-11'),
      })

      // Rainfall factor should not adjust
      expect(resultingField.rainfallFactor).toEqual(rainfallFactor)
      // But the max dry days should be adjusted since this was a dry period
      expect(resultingField.maxDryDays).toEqual(10)
    })

    test('should adjust maxDryDays if the previous period was dry and no rain this period', () => {
      const maxDryDays = 14
      // The previous period was dry as well:
      const previousRainfallDays = 0
      const rainfallDays = 0
      const rainfallFactor = 1
      const lastPainted = new Date('2023-10-01')

      const resultingField = getFieldWithAdjustedRainFactorAndDryDays({
        currentField: {
          maxDryDays,
          previousRainfallDays,
          rainfallDays,
          rainfallFactor,
          lastPainted,
        },
        // Marking it unplayable at 10 days
        markUnplayableOn: new Date('2023-10-11'),
      })

      // Rainfall factor should not adjust
      expect(resultingField.rainfallFactor).toEqual(rainfallFactor)
      // But the max dry days should be adjusted since this was a dry period
      expect(resultingField.maxDryDays).toEqual(10)
    })

    test('should adjust rainfall factor if there was rain this period, regardless of previous', () => {
      // This is probably the "normal" case where there has been rainfall
      // in at least the last two periods (or no previous period)
      // In this case we simply use the current rainfall to adjust the factor
      const maxDryDays = 14
      // Previous is ignored since we hae rainfall days this period
      const previousRainfallDays = 5
      const rainfallDays = 2
      const rainfallFactor = 1
      const lastPainted = new Date('2023-10-01')

      const resultingField = getFieldWithAdjustedRainFactorAndDryDays({
        currentField: {
          maxDryDays,
          previousRainfallDays,
          rainfallDays,
          rainfallFactor,
          lastPainted,
        },
        // 9 days and the previous factor would have been 12
        // So adjust the factor to make it work for 9
        markUnplayableOn: new Date('2023-10-10'),
      })

      expect(resultingField.rainfallFactor).toEqual(2.5)
    })
  })
})
