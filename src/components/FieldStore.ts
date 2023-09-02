import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_PUBLIC_SUPABASE_URL,
  import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY,
)

export const getFields = async () => {
  const { data } = await supabase.from('fields').select('*')

  return data
}
