import { Field } from '../utilities/types'

export const generateFields = (count?: number): Field[] => {
  return [
    {
      id: '1',
      code: 'Nk-1',
      name: 'Nakuru 1',
      description: 'Nakuru 1',
      size: 'full',
      customWidth: undefined,
      customLength: undefined,
      maxDryDays: 0,
      rainfallDays: 0,
      rainfallFactor: 0,
      lastPainted: new Date(),
      shouldPaint: 0,
      markedUnplayable: new Date(),
      sortOrder: 0,
      active: true,
    },
  ]
}
