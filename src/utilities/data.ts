import { SupabaseClient } from '@supabase/supabase-js'
import { Field, PaintHistory } from './types'
import { convertUnderscoreToCamelCase, mapFields } from './utils'

// Use a brute force local storage to cache the user and fields
// This allows us to at least read the application when you are off line (akhum Brooklyn)
const setCache = (key: 'user' | 'fields' | 'paintTeam', data: any) => {
  localStorage.setItem(key, JSON.stringify(data))
}

const getFromCache = (key: 'user' | 'fields' | 'paintTeam') => {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : undefined
}

export const getUser = async ({
  supabase,
  useCache,
}: {
  supabase: SupabaseClient
  useCache?: boolean
}) => {
  let paintTeam
  let user

  if (useCache) {
    paintTeam = convertUnderscoreToCamelCase(getFromCache('user'))
    user = convertUnderscoreToCamelCase(getFromCache('paintTeam'))
  } else {
    const result = await supabase
      .from('users')
      .select(
        `
      *,
      paintTeam: paint_team_id (
        *
      )
    `,
      )
      .limit(1)

    setCache('paintTeam', result.data?.[0]?.paintTeam)
    setCache('user', result.data?.[0])

    paintTeam = convertUnderscoreToCamelCase(result.data?.[0]?.paintTeam)
    user = convertUnderscoreToCamelCase(result.data?.[0])
  }

  return { ...(user ?? {}), paintTeam }
}

export const getFields = async ({
  supabase,
  useCache,
}: {
  supabase: SupabaseClient
  useCache?: boolean
}): Promise<Field[]> => {
  let result
  if (useCache) {
    result = getFromCache('fields')
  } else {
    const { data } = await supabase
      ?.from('fields')
      .select('*')
      .eq('active', true)
      .eq('deleted', false)
      .order('name')
    result = data

    setCache('fields', result)
  }

  return mapFields(result ?? [])
}

export const getField = async ({
  supabase,
  id,
  useCache,
}: {
  supabase: SupabaseClient
  id: string
  useCache?: boolean
}): Promise<Field | undefined> => {
  let result
  if (useCache) {
    const allTeams = getFromCache('fields')
    result = allTeams?.find((field: Field) => field.id === id)
  } else {
    const { data } = await supabase
      ?.from('fields')
      .select('*')
      .eq('id', id)
      .limit(1)
    result = data
  }

  return mapFields(result ?? [])?.[0]
}

export const getPaintHistory = async ({
  fieldId,
  supabase,
}: {
  fieldId: Field['id']
  supabase: SupabaseClient
}): Promise<PaintHistory[] | undefined> => {
  // Getting the Paint History is only done when we are modifying a field
  // So we don't use cache
  const result = await supabase
    ?.from('paint_history')
    .select('*')
    .eq('field_id', fieldId)
    .order('created_at')
    .limit(3)

  if (result?.data?.length) {
    return result.data.map((historyItem) =>
      convertUnderscoreToCamelCase(historyItem),
    )
  }
}
