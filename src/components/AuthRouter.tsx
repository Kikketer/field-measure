import { Outlet } from '@solidjs/router'
import { Authenticated } from './Authenticated'
import { AuthenticationProvider } from './AuthenticationProvider'
import { MessagingProvider } from './MessagingProvider.tsx'
import { TeamProvider } from './TeamProvider'
import { VisibleProvider } from './VisibleProvider'
import { FieldsProvider } from './FieldsProvider'

export const AuthRouter = () => {
  return (
    <AuthenticationProvider>
      <Authenticated>
        <MessagingProvider>
          <VisibleProvider>
            <TeamProvider>
              <FieldsProvider>
                <Outlet />
              </FieldsProvider>
            </TeamProvider>
          </VisibleProvider>
        </MessagingProvider>
      </Authenticated>
    </AuthenticationProvider>
  )
}
