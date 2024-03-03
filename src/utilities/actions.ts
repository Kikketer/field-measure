import { SupabaseClient } from '@supabase/supabase-js'
import { differenceInCalendarDays } from 'date-fns'
import { getPaintHistory } from './data'
import { getFieldWithAdjustedRainFactorAndDryDays } from './predictNextPainting'
import { Field } from './types'
import { mapFields, unmapField } from './utils'

export const paintField = async ({
  field,
  adjustFactor,
  supabase,
}: {
  field: Field
  adjustFactor?: boolean
  supabase: SupabaseClient
}) => {
  let resultingField = field
  if (adjustFactor) {
    const paintHistory = await getPaintHistory({
      fieldId: field.id,
      supabase,
    })
    console.log('Getting the paint history ', paintHistory)
    resultingField = getFieldWithAdjustedRainFactorAndDryDays({
      currentField: field,
      markUnplayableOn: new Date(),
      paintHistory: paintHistory ?? [],
    })

    console.log('field with adjusted factor: ', resultingField)

    // Log the paint history only if this will adjust the factor
    await supabase?.from('paint_history').insert({
      field_id: field.id,
      rainfall_factor: field.rainfallFactor,
      rainfall_days: field.rainfallDays,
      days_unpainted: differenceInCalendarDays(
        new Date(),
        new Date(field.lastPainted),
      ),
    })
  }

  resultingField.lastPainted = new Date()
  resultingField.rainfallDays = 0

  // And save the field
  const savedField = await supabase
    ?.from('fields')
    .upsert(unmapField(resultingField))
    .select()

  console.log('Final field ', savedField)

  return mapFields(savedField.data ?? [])[0]
}
