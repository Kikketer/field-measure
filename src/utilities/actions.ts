import { Field } from './types'

export const paintField = async ({
  field,
  shouldAlterFactor,
}: {
  field: Field
  shouldAlterFactor?: boolean
}) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {}
}
