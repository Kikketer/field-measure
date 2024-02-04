import { LoaderFunctionArgs } from '@vercel/remix'
import { createServerClient } from '@supabase/auth-helpers-remix'
import { differenceInCalendarDays } from 'date-fns'
import { Database } from '~/database.types'
import { groupFields } from './groupFields'

type Field = Database['public']['Tables']['fields']['Row']

export const updateField = async ({
  request,
  fieldName,
  field,
}: {
  request: LoaderFunctionArgs['request']
  fieldName: Field['name']
  field: Partial<Field>
}): Promise<Field | undefined> => {
  // Update the field in supabase
  const response = new Response()
  const supabaseClient = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response },
  )

  // Get the original field
  const { data: foundField } = await supabaseClient
    .from('fields')
    .select('*')
    .eq('name', fieldName)

  if (!foundField?.length) return

  // removes the id (and other things I don't want you to be able to edit)
  const { id, ...siftedField } = foundField[0]

  console.log('Saving field ', { ...siftedField, ...field })

  const { data: newFields } = await supabaseClient
    .from('fields')
    .update({ ...siftedField, ...field })
    .eq('id', id)
    .select('*')

  return newFields?.[0]
}

export const getField = async ({
  request,
  name,
}: {
  request: LoaderFunctionArgs['request']
  name: Field['name']
}): Promise<Field | undefined> => {
  const response = new Response()
  const supabaseClient = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response },
  )

  const { data } = await supabaseClient
    .from('fields')
    .select('*')
    .eq('active', true)
    .eq('deleted', false)
    .eq('name', name)
  if (!data?.length) return

  return data[0]
}

export const getFields = async ({
  request,
}: Pick<LoaderFunctionArgs, 'request'>) => {
  const response = new Response()
  const supabaseClient = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response },
  )

  const { data } = await supabaseClient
    .from('fields')
    .select('*')
    .eq('active', true)
    .eq('deleted', false)
    .order('name')
  if (!data?.length) return

  return groupFields(data)
}

export const getPaintHistory = async ({
  request,
  fieldId,
}: {
  request: LoaderFunctionArgs['request']
  fieldId: Database['public']['Tables']['fields']['Row']['id']
}): Promise<
  Database['public']['Tables']['paint_history']['Row'][] | undefined
> => {
  const response = new Response()
  const supabaseClient = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response },
  )

  const { data } = await supabaseClient
    .from('paint_history')
    .select('*')
    .eq('field_id', fieldId)
    .order('created_at', { ascending: false })
    .limit(3)

  if (!data?.length) return

  return data
}

export const logPaintedField = async ({
  request,
  field,
  previouslyPaintedOn,
}: {
  request: LoaderFunctionArgs['request']
  field: Field
  previouslyPaintedOn: Date
}) => {
  const response = new Response()
  const supabaseClient = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response },
  )

  return supabaseClient?.from('paint_history').insert({
    field_id: field.id,
    rainfall_factor: field.rainfall_factor,
    rainfall_days: field.rainfall_days,
    days_unpainted: differenceInCalendarDays(
      new Date(field.last_painted ?? new Date()),
      previouslyPaintedOn,
    ),
  })
}
