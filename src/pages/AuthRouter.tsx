import { Outlet } from '@solidjs/router'
import { Authenticated } from '../components/Authenticated'
import { AuthenticationProvider } from '../components/AuthenticationProvider'

export const AuthRouter = () => {
  return (
    <AuthenticationProvider>
      <Authenticated>
        <Outlet />
      </Authenticated>
    </AuthenticationProvider>
  )
}
