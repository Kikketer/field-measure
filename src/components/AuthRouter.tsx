import { Outlet } from '@solidjs/router'
import { Authenticated } from './Authenticated'
import { AuthenticationProvider } from '../providers/AuthenticationProvider'
// import { MessagingProvider } from '../providers/MessagingProvider.tsx'
import { TeamProvider } from '../providers/TeamProvider'
import { VisibleProvider } from '../providers/VisibleProvider'
import { FieldsProvider } from '../providers/FieldsProvider'

export const AuthRouter = () => {
  return (
    <AuthenticationProvider>
      <Authenticated>
        {/*<MessagingProvider>*/}
        <VisibleProvider>
          <TeamProvider>
            <FieldsProvider>
              <Outlet />
            </FieldsProvider>
          </TeamProvider>
        </VisibleProvider>
        {/*</MessagingProvider>*/}
      </Authenticated>
    </AuthenticationProvider>
  )
}
