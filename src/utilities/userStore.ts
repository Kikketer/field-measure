import { useContext } from 'solid-js'
import { SupabaseContext } from '../components/SupabaseProvider'

export const getUser = async () => {
  const supabaseContext = useContext(SupabaseContext)

  try {
    const result = await supabaseContext.supabase.from('paintteam').select('*')

    return { paintTeam: result.data[0] }
  } catch (err) {
    console.error(err)
    return { paintTeam: {} }
  }
}
