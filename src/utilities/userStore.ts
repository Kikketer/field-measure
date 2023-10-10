import { supabase } from '../components/supabase.ts'

export const getUser = async () => {
  try {
    const result = await supabase.from('paintteam').select('*')

    return { paintTeam: result.data[0] }
  } catch (err) {
    console.error(err)
    return { paintTeam: {} }
  }
}
