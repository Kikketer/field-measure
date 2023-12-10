import { useContext } from 'solid-js'
import { SupabaseContext } from '../components/SupabaseProvider'

export const getUser = async () => {
  const supabaseContext = useContext(SupabaseContext)

  try {
    // Note that the RLS prevents us from selecting anything more than what's just us
    // We will run into an issue if you have more than one paint team (later!)
    const user = await supabaseContext?.supabase.from('users').select(`
      *,
      paintTeam: paint_team_id (
        *
      )
    `)

    return user.data?.[0]
  } catch (err) {
    console.error(err)
    return { paintTeam: {} }
  }
}
