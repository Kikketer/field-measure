import { Field } from '../utilities/types'

const fields: Field[] = [
  {
    id: '1',
    name: 'Field A',
    description:
      'South side of the park with a really long description that you may not see all of it',
    size: 'Full',
    maxDryDays: 7,
    rainfallDays: 0,
    rainfallFactor: 1,
    lastPainted: new Date('2021-01-01'),
    markedUnplayable: new Date('2021-01-01'),
    sortOrder: 1,
    paintTeamId: 1,
  },
]

export const getFields = async (): Promise<Field[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return fields
}

export const getField = async (id: string): Promise<Field | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return fields.find((field) => field.id === id)
}
