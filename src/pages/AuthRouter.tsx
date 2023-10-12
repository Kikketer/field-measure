import { Outlet } from '@solidjs/router'
import { Authenticated } from '../components/Authenticated'
import { AuthenticationProvider } from '../components/AuthenticationProvider'
import { VisibleProvider } from '../components/VisibleProvider.tsx'

export const AuthRouter = () => {
  return (
    <AuthenticationProvider>
      <Authenticated>
        <VisibleProvider>
          <Outlet />
        </VisibleProvider>
      </Authenticated>
    </AuthenticationProvider>
  )
}
