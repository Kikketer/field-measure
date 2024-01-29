import { createServerClient } from '@supabase/auth-helpers-remix'
import { Database } from '~/database.types'
import { groupFields } from './groupFields'

type Field = Database['public']['Tables']['fields']['Row']

export const updateField = async ({
  request,
  fieldName,
  field,
}: {
  request: any
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
  request: any
  name: Field['name']
}) => {
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

export const getFields = async ({ request }: { request: any }) => {
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

export const markFieldPainted = async (id: Field['id']) => {}
