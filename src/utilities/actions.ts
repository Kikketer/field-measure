import { SupabaseClient } from '@supabase/supabase-js'
import { differenceInCalendarDays } from 'date-fns'
import { getPaintHistory } from './data'
import { getFieldAsUnplayable } from './getFieldAsUnplayable'
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
  let resultingField = { ...field }
  if (adjustFactor) {
    const paintHistory = await getPaintHistory({
      fieldId: field.id,
      supabase,
    })
    resultingField = getFieldWithAdjustedRainFactorAndDryDays({
      currentField: field,
      markUnplayableOn: new Date(),
      paintHistory: paintHistory ?? [],
    })

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

  return mapFields(savedField.data ?? [])[0]
}

/**
 * Used to mark the field unplayable on a date so that it's due to be painted
 * this does not mark the field painted.
 */
export const markFieldUnplayable = async ({
  field,
  supabase,
  unplayableOn,
}: {
  field: Field
  supabase: SupabaseClient
  unplayableOn?: Date
}): Promise<Field> => {
  const resultingField = getFieldAsUnplayable({
    field,
    unplayableOn: unplayableOn ?? new Date(),
  })
  return await saveField({ field: resultingField, supabase })
}

export const mowField = async ({
  field,
  supabase,
}: {
  field: Field
  supabase: SupabaseClient
}) => {
  // Update the fields "last_mowed" column to today:
  const savedField = await supabase
    ?.from('fields')
    .update({ last_mowed: new Date() })
    .eq('id', field.id)
    .select()

  // Log this mow (used for averages later...)
  await supabase?.from('mow_history').insert({
    field_id: field.id,
  })

  return mapFields(savedField.data ?? [])[0]
}

export const saveField = async ({
  field,
  supabase,
}: {
  field: Partial<Field>
  supabase: SupabaseClient
}) => {
  if (!field.name) {
    throw new Error('Invalid field')
  }

  // If we don't provide a last painted, we make it 99 days in the past
  // 99 because that makes the UI mark it as painted but not affect the factor
  if (!field.lastPainted) {
    field.lastPainted = new Date()
    field.lastPainted.setDate(field.lastPainted.getDate() - 99)

    // Make make the predicted date 99 days ago as well for this same reason
    field.predictedNextPaint = new Date()
    field.predictedNextPaint.setDate(field.predictedNextPaint.getDate() - 99)
  }

  const savedField = await supabase
    ?.from('fields')
    .upsert(unmapField(field))
    .select()

  return mapFields(savedField.data ?? [])[0]
}

export const joinTeam = async ({
  joinCode,
  supabase,
}: {
  joinCode: string
  supabase: SupabaseClient
}) => {
  if (!joinCode) {
    throw new Error('Invalid join code')
  }

  const team = await supabase
    .from('paint_team')
    .select()
    .eq('join_code', joinCode)
    .limit(1)

  if (team?.data && team.data.length > 0) {
    const user = await supabase.auth.getUser()
    await supabase
      .from('users')
      .upsert({
        user_id: user.data.user?.id,
        paint_team_id: team.data[0].id,
      })
      .select()
  } else {
    throw new Error('Invalid join code')
  }
}
