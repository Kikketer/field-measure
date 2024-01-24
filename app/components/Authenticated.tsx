import { FC, PropsWithChildren } from 'react'
import { useAuthentication } from '~/providers/AuthenticationProvider'

export const Authenticated: FC<PropsWithChildren> = ({ children }) => {
  const auth = useAuthentication()

  return <>{children}</>
}
