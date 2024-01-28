import { Database } from '~/database.types'

type Field = Database['public']['Tables']['fields']['Row']

export const groupFields = (
  fields: Field[],
): { [groupName: string]: Field[] } => {
  // Group by "group"
  return fields.reduce((acc: { [groupName: string]: Field[] }, field) => {
    if (!field.group) {
      acc.Other ? acc.Other.push(field) : (acc.Other = [field])
      return acc
    }

    if (!acc[field.group]) {
      acc[field.group] = []
    }
    acc[field.group].push(field)
    return acc
  }, {})
}
