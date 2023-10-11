import { Outlet } from '@solidjs/router'
import { Authenticated } from '../components/Authenticated'
import { AuthenticationProvider } from '../components/AuthenticationProvider'
import { RefetchData } from '../components/RefetchData.tsx'

export const AuthRouter = () => {
  return (
    <AuthenticationProvider>
      <Authenticated>
        <RefetchData />
        <Outlet />
      </Authenticated>
    </AuthenticationProvider>
  )
}
