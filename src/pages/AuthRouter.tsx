import { Outlet } from '@solidjs/router'
import { Authenticated } from '../components/Authenticated'
import { AuthenticationProvider } from '../components/AuthenticationProvider'
import { VisibleProvider } from '../components/VisibleProvider'
import { FieldsProvider } from '../components/FieldsProvider'

export const AuthRouter = () => {
  return (
    <AuthenticationProvider>
      <Authenticated>
        <VisibleProvider>
          <FieldsProvider>
            <Outlet />
          </FieldsProvider>
        </VisibleProvider>
      </Authenticated>
    </AuthenticationProvider>
  )
}
