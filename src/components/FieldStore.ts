// import { createClient } from '@supabase/supabase-js'

import { Field } from '../types'

// const supabase = createClient(
//   import.meta.env.VITE_PUBLIC_SUPABASE_URL,
//   import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY,
// )

const mapFields = (fields: any[]): Field[] => {
  // Convert all keys with underscores to camelCase:
  const duplicateFields = fields.slice()

  duplicateFields.forEach((field) => {
    Object.keys(field).forEach((key) => {
      const newKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
      if (newKey !== key) {
        field[newKey] = field[key]
        delete field[key]
      }
    })

    // Convert playable and archived to boolean:
    field.playable = field.playable === 1
    field.archived = field.archived === 1

    // Convert the dates to Date objects:
    field.createdAt = new Date(field.createdAt)
    field.lastPainted = new Date(field.lastPainted)
  })

  return duplicateFields
}

export const getFields = async (): Promise<Field[]> => {
  // const { data } = await supabase.from('fields').select('*')
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const data: any[] = [
    {
      id: 'a18e716b-8d31-48a5-b1f4-a2b566db618e',
      created_at: '2023-09-02T14:02:54.319276+00:00',
      code: 'JPW-23',
      name: 'JPW-23',
      size: 'Full',
      description: 'Jaycee Park near shed',
      degrade_factor: 1,
      rainfall_total: 0,
      last_painted: '2023-08-26T12:00:00',
      playable: 1,
      archived: 0,
      sort_order: 0,
      paint_factor: 0,
    },
    {
      id: 'a18e716b-8d31-48a5-b1f4-a2b566db6181',
      created_at: '2023-09-02T14:02:54.319276+00:00',
      code: 'NKE-14',
      name: 'NKE-14',
      size: 'Full',
      description: 'Neverwood Knoll',
      degrade_factor: 1,
      rainfall_total: 0,
      last_painted: '2023-08-10T12:00:00',
      playable: 1,
      archived: 0,
      sort_order: 1,
      paint_factor: 0,
    },
  ]

  // Sort the data by sort_order ascending:
  data.sort((a, b) => a.sort_order - b.sort_order)

  return mapFields(data)
}

export const getField = async (id: Field['id']): Promise<Field> => {
  console.log('Getting field by ID', id)
  return (await getFields()).find((field) => field.id === id)!
}

export const getArchivedFields = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const data: any[] = [
    {
      id: 'a18e716b-8d31-48a5-b1f4-xxxs',
      created_at: '2023-09-02T14:02:54.319276+00:00',
      code: 'NPP-11',
      name: 'NPP-11',
      size: 'Full',
      description: 'Jaycee Park near shed',
      degrade_factor: 1,
      rainfall_total: 0,
      last_painted: '2023-08-26T12:00:00',
      playable: 1,
      archived: 0,
      sort_order: 0,
      paint_factor: 0,
    },
    {
      id: 'a18e716b-8d31-48a5-b1f4-a2b566db6181',
      created_at: '2023-09-02T14:02:54.319276+00:00',
      code: 'PWE-111',
      name: 'PWE-111',
      size: 'Full',
      description: 'Neverwood Knoll',
      degrade_factor: 1,
      rainfall_total: 0,
      last_painted: '2023-08-10T12:00:00',
      playable: 1,
      archived: 0,
      sort_order: 1,
      paint_factor: 0,
    },
  ]

  return mapFields(data)
}
