import { Outlet } from '@solidjs/router'
import { Authenticated } from './Authenticated'
import { AuthenticationProvider } from './AuthenticationProvider'
import { MessagingProvider } from './MessagingProvider.tsx'
import { VisibleProvider } from './VisibleProvider'
import { FieldsProvider } from './FieldsProvider'

export const AuthRouter = () => {
  return (
    <AuthenticationProvider>
      <Authenticated>
        <MessagingProvider>
          <VisibleProvider>
            <FieldsProvider>
              <Outlet />
            </FieldsProvider>
          </VisibleProvider>
        </MessagingProvider>
      </Authenticated>
    </AuthenticationProvider>
  )
}
