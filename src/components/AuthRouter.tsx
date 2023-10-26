import { Outlet } from '@solidjs/router'
import { Authenticated } from './Authenticated'
import { AuthenticationProvider } from './AuthenticationProvider'
import { VisibleProvider } from './VisibleProvider'
import { FieldsProvider } from './FieldsProvider'

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
