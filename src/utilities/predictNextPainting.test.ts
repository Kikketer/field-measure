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
    test('should not adjust rainfall factor or days if there was no rainfall this period and we were accurate', () => {
      const maxDryDays = 10
      const rainfallDays = 0
      const rainfallFactor = 1.654
      const lastPainted = new Date('2023-12-12T06:00:00+00:00')
      // Even if there is a rainfall history, since we were accurate
      // we do not factor this into the result
      const paintHistory = [{ rainfallFactor: 1, daysUnpainted: 5 }]

      const resultingField = getFieldWithAdjustedRainFactorAndDryDays({
        currentField: {
          maxDryDays,
          rainfallDays,
          rainfallFactor,
          lastPainted,
        },
        // Marked unplayable 10 days after it's last paint which is equal to our max dry days
        markUnplayableOn: new Date('2023-12-22T06:00:00+00:00'),
        paintHistory,
      })

      // The current period is 10 days
      // We were accurate so we leave the factor and the maxDryDays alone
      expect(resultingField.rainfallFactor).toEqual(1.654)
      expect(resultingField.maxDryDays).toEqual(10)
    })

    test('should adjust the max dry days if there was no rainfall this period and unplayable was marked after the current maxDryDays', () => {
      const maxDryDays = 14
      const rainfallDays = 0
      const rainfallFactor = 1
      const lastPainted = new Date('2023-10-01T06:00:00.000Z')
      // For adjusting the max dry days, we do not want to use the history average
      // So this is here to prove that it will not be used
      const paintHistory = [{ rainfallFactor: 1, daysUnpainted: 5 }]

      const resultingField = getFieldWithAdjustedRainFactorAndDryDays({
        currentField: {
          maxDryDays,
          rainfallDays,
          rainfallFactor,
          lastPainted,
        },
        // Marking it unplayable at 17 days (higher than the previous max dry)
        markUnplayableOn: new Date('2023-10-18T06:00:00.000Z'),
        paintHistory,
      })

      expect(resultingField.rainfallFactor).toEqual(1)
      expect(resultingField.maxDryDays).toEqual(17)
    })

    test('should set rainfall factor to 0 and adjust maxDryDays if there was no rainfall this period and unplayable was marked after the current maxDryDays', () => {
      const maxDryDays = 9
      const rainfallDays = 1
      const rainfallFactor = 1
      const lastPainted = new Date('2023-10-01')
      const paintHistory = [{ rainfallFactor: 1, daysUnpainted: 5 }]

      const resultingField = getFieldWithAdjustedRainFactorAndDryDays({
        currentField: {
          maxDryDays,
          rainfallDays,
          rainfallFactor,
          lastPainted,
        },
        // Marking it unplayable at 17 days (higher than the previous max dry)
        markUnplayableOn: new Date('2023-10-12'),
        paintHistory,
      })

      expect(resultingField.rainfallFactor).toEqual(0)
      expect(resultingField.maxDryDays).toEqual(11)
    })

    test('should adjust maxDryDays if there is no previous period and no rain this period', () => {
      const maxDryDays = 14
      const rainfallDays = 0
      const rainfallFactor = 1
      const lastPainted = new Date('2023-10-01')
      const paintHistory = []

      const resultingField = getFieldWithAdjustedRainFactorAndDryDays({
        currentField: {
          maxDryDays,
          rainfallDays,
          rainfallFactor,
          lastPainted,
        },
        // Marking it unplayable at 10 days
        markUnplayableOn: new Date('2023-10-11'),
        paintHistory,
      })

      // Rainfall factor should not adjust
      expect(resultingField.rainfallFactor).toEqual(rainfallFactor)
      // But the max dry days should be adjusted since this was a dry period
      expect(resultingField.maxDryDays).toEqual(10)
    })

    test('should adjust maxDryDays if the previous period was dry and no rain this period', () => {
      const maxDryDays = 14
      const rainfallDays = 0
      const rainfallFactor = 1
      const lastPainted = new Date('2023-10-01')
      // The previous period was dry as well:
      const paintHistory = [
        // { rainfallDays: 0, rainfallFactor: 1, daysUnpainted: 5 },
      ]

      const resultingField = getFieldWithAdjustedRainFactorAndDryDays({
        currentField: {
          maxDryDays,
          rainfallDays,
          rainfallFactor,
          lastPainted,
        },
        // Marking it unplayable at 10 days
        markUnplayableOn: new Date('2023-10-11'),
        paintHistory,
      })

      // Rainfall factor should not adjust
      expect(resultingField.rainfallFactor).toEqual(rainfallFactor)
      // But the max dry days should be adjusted since this was a dry period
      expect(resultingField.maxDryDays).toEqual(10)
    })

    test('should adjust rainfall factor if there was rain this period and an average of previous rainfall factors', () => {
      // This is probably the "normal" case where there has been rainfall
      // in at least the last two periods (or no previous period)
      // In this case we simply use the current rainfall to adjust the factor
      const maxDryDays = 14
      const rainfallDays = 2
      const rainfallFactor = 1
      const lastPainted = new Date('2023-10-01')
      // Previous is ignored since we hae rainfall days this period
      const paintHistory = [{ rainfallFactor: 1, daysUnpainted: 5 }]

      const resultingField = getFieldWithAdjustedRainFactorAndDryDays({
        currentField: {
          maxDryDays,
          rainfallDays,
          rainfallFactor,
          lastPainted,
        },
        // 9 days and the previous factor would have been 12
        // So adjust the factor to make it work for 9
        markUnplayableOn: new Date('2023-10-10'),
        paintHistory,
      })

      // Rainfall factor changes to 1.75 because of the previous factor of 1,
      // current factor of 1 but the dates have changed from 14 days to 9
      expect(resultingField.rainfallFactor).toEqual(1.75)
    })

    test('should have the resulting rainfall factor be the same if the predicted date is correct', () => {
      const maxDryDays = 14
      const rainfallDays = 2
      const rainfallFactor = 1
      const lastPainted = new Date('2023-10-01')
      // Previous is ignored since we have rainfall days this period
      // const paintHistory = [{ rainfallFactor: 1, daysUnpainted: 11 }]

      const resultingField = getFieldWithAdjustedRainFactorAndDryDays({
        currentField: {
          maxDryDays,
          rainfallDays,
          rainfallFactor,
          lastPainted,
        },
        // The predicated next date is 10/13 so since we were correct we should
        // Not adjust the rainfall factor
        markUnplayableOn: new Date('2023-10-13'),
        paintHistory: [],
        // paintHistory,
      })

      // Rainfall factor changes to 1.75 because of the previous factor of 1,
      // current factor of 1 but the dates have changed from 14 days to 9
      expect(resultingField.rainfallFactor).toEqual(1)
    })
  })
})
