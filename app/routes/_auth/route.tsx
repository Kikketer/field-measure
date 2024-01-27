import { useOutletContext } from '@remix-run/react'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '~/database.types'

export async function loader() {
  await Promise.resolve()

  return {}
}

export default function Authenticated() {
  // const { supabase } = useOutletContext<{
  //   supabase: SupabaseClient<Database>
  // }>()
  // const { user, loading } = useAuthentication()
  // const navigate = useNavigate()

  // useEffect(() => {
  //   if (!user && !loading) {
  //     navigate('/', { replace: true })
  //   }
  // }, [user, loading])

  return (
    <div>
      <h1>Auth</h1>
      {/*<Outlet />*/}
    </div>
  )
}
