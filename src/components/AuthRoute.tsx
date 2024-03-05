import { PropsWithChildren } from 'react'
import { UserProvider } from './UserProvider'

export const AuthRoute: React.FC<PropsWithChildren> = ({ children }) => {
  return <UserProvider>{children}</UserProvider>
}
