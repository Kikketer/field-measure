import { Outlet } from '@remix-run/react'
import { AuthenticationProvider } from '~/providers/AuthenticationProvider'
import { SupabaseProvider } from '~/providers/SupabaseProvider'

function Authenticated() {
  return (
    <div>
      <h1>Auth</h1>
      <Outlet />
    </div>
  )
}

export default function AuthenticatedRoute() {
  return (
    <SupabaseProvider>
      <AuthenticationProvider>
        <Authenticated />
      </AuthenticationProvider>
    </SupabaseProvider>
  )
}
