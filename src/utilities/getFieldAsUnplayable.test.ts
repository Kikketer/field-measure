import { getFieldAsUnplayable } from './getFieldAsUnplayable'
import { Field } from './types'

const mockField: Field = {
  markedUnplayable: new Date('2024-03-01T12:00:00.000Z'),
  // Last painted isn't used, we look to markedUnplayable for this
  lastPainted: new Date('2024-03-01T12:00:00.000Z'),
  paintTeamId: 0,
  sortOrder: 0,
  id: '1',
  name: 'Mock Field',
  description: 'Mock Description',
  group: 'Mock Group',
  size: 'Mock Size',
  customWidth: 1,
  customLength: 1,
  // Predicted to be 14 days in the future:
  predictedNextPaint: new Date('2024-03-15T12:00:00.000Z'),
  rainfallFactor: 1,
  rainfallDays: 0,
  maxDryDays: 14,
}

describe('getFieldAsUnplayable', () => {
  it('should adjust rainfall factor if there was rainfall for this field and the prediction was after the unplayableOn date but before the max dry date', () => {
    // This field has 12 days until it's due to be painted (14 - 2 * 1)
    const field = {
      ...mockField,
      rainfallDays: 2,
      maxDryDays: 14,
      predictedNextPaint: new Date('2024-03-13T12:00:00.000Z'),
      rainfallFactor: 1,
    }

    const resultingField = getFieldAsUnplayable({
      field,
      // Marked unplayable before the predicted date: (by 3 days)
      unplayableOn: new Date('2024-03-10T12:00:00.000Z'),
    })

    // Unchanged rainfall days:
    expect(resultingField.rainfallDays).toBe(2)
    // Rainfall factor should be adjusted upwards to make the predictedDate match the unplayable date:
    expect(resultingField.rainfallFactor).toBe(2.5)
    // The predicted date should be the same as the unplayable date:
    expect(resultingField.predictedNextPaint).toEqual(
      new Date('2024-03-10T12:00:00.000Z'),
    )
  })

  it('should adjust rainfall factor if there was rainfall for this field and the prediction was before the unplayableOn date but before the max dry date', () => {
    // This is for fields that are in the red, but they were playable until a date past the predicted date
    const field = {
      ...mockField,
      rainfallDays: 2,
      maxDryDays: 10,
      // Predicted for the 9th (10maxDry - 2rainfallDays * 1rainfallFactor) + lastPainted
      // It should be adjusted for the 12th (10maxDry - 2rainfallDays * X) + 1lastPainted = 12th
      predictedNextPaint: new Date('2024-03-09T12:00:00.000Z'),
      rainfallFactor: 1,
    }

    const resultingField = getFieldAsUnplayable({
      field,
      // Marked unplayable after the predicted date but less than the 10 max days
      unplayableOn: new Date('2024-03-10T12:00:00.000Z'),
    })

    // Unchanged rainfall days:
    expect(resultingField.rainfallDays).toBe(2)
    // Rainfall factor should be adjusted downwards to make the predictedDate match the unplayable date:
    expect(resultingField.rainfallFactor).toBe(0.5)
    // The predicted date should be the same as the unplayable date:
    expect(resultingField.predictedNextPaint).toEqual(
      new Date('2024-03-10T12:00:00.000Z'),
    )
  })

  it('should adjust the max dry days and set factor to 0 if the unplayable date is after the last painted + max dry days', () => {
    // This field has 12 days until it's due to be painted (14 - 2 * 1)
    const field = {
      ...mockField,
      rainfallDays: 2,
      maxDryDays: 14,
      // Predicted date is 12 days after last painted because of the rainfall factor:
      // 1st + (14 - 2 * 1) = 13th
      predictedNextPaint: new Date('2024-03-13T12:00:00.000Z'),
      rainfallFactor: 1,
    }

    const resultingField = getFieldAsUnplayable({
      field,
      // Marked unplayable after the max dry date:
      unplayableOn: new Date('2024-03-18T12:00:00.000Z'),
    })

    // Unchanged rainfall days:
    expect(resultingField.rainfallDays).toBe(2)
    // Rainfall factor should be 0
    expect(resultingField.rainfallFactor).toBe(0)
    // The maxDryDays should be adjusted to make the predictedDate match the unplayable date:
    expect(resultingField.maxDryDays).toBe(17)
    // The predicted date should be the same as the unplayable date:
    expect(resultingField.predictedNextPaint).toEqual(
      new Date('2024-03-18T12:00:00.000Z'),
    )
  })

  it('should adjust the maxDryDays if there was no rainfall for this field when marked unplayable before predicted date', () => {
    // This field has 12 days until it's due to be painted (14 - 2 * 1)
    const field = {
      ...mockField,
      rainfallDays: 0,
      maxDryDays: 14,
      // Predicted is 14 days after the 1st since there are no rainfall days
      predictedNextPaint: new Date('2024-03-15T12:00:00.000Z'),
      rainfallFactor: 1,
    }

    const resultingField = getFieldAsUnplayable({
      field,
      // Marked unplayable before the predicted date: (by 3 days)
      unplayableOn: new Date('2024-03-12T12:00:00.000Z'),
    })

    // Unchanged rainfall days:
    expect(resultingField.rainfallDays).toBe(0)
    // Rainfall factor should be unchanged
    expect(resultingField.rainfallFactor).toBe(1)
    // The maxDryDays should be adjusted to make the predictedDate match the unplayable date:
    expect(resultingField.maxDryDays).toBe(11)
    // The predicted date should be the same as the unplayable date:
    expect(resultingField.predictedNextPaint).toEqual(
      new Date('2024-03-12T12:00:00.000Z'),
    )
  })

  it('should adjust the maxDryDays if there was no rainfall for this field when marked unplayable after predicted date but before the max dry days', () => {
    // This field has 12 days until it's due to be painted (14 - 2 * 1)
    const field = {
      ...mockField,
      rainfallDays: 0,
      maxDryDays: 14,
      // Predicted is 14 days after the 1st since there are no rainfall days
      predictedNextPaint: new Date('2024-03-15T12:00:00.000Z'),
      rainfallFactor: 1,
    }

    const resultingField = getFieldAsUnplayable({
      field,
      // Marked unplayable after the predicted date: (by 3 days)
      unplayableOn: new Date('2024-03-18T12:00:00.000Z'),
    })

    // Unchanged rainfall days:
    expect(resultingField.rainfallDays).toBe(0)
    // Rainfall factor should be unchanged
    expect(resultingField.rainfallFactor).toBe(1)
    // The maxDryDays should be adjusted to make the predictedDate match the unplayable date:
    expect(resultingField.maxDryDays).toBe(17)
    // The predicted date should be the same as the unplayable date:
    expect(resultingField.predictedNextPaint).toEqual(
      new Date('2024-03-18T12:00:00.000Z'),
    )
  })
})
