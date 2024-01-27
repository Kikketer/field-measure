import { Outlet, useNavigate } from '@remix-run/react'
import { useEffect } from 'react'
// import { useAuthentication } from '~/providers/AuthenticationProvider'

export async function loader() {
  await Promise.resolve()

  return {}
}

export default function Authenticated() {
  // const { user, loading } = useAuthentication()
  const navigate = useNavigate()

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
