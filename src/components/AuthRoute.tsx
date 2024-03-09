import { PropsWithChildren } from 'react'

export const AuthRoute: React.FC<PropsWithChildren> = ({ children }) => {
  // Just check to see if we are logged in, but don't use this for anything real
  // as it's not secure:
  // if (!localStorage.getItem('provider_token')) {
  //   window.location.href = '/'
  // }

  return <>{children}</>
}
