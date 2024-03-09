import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { useSupabase } from './SupabaseProvider'

export const AuthRoute: React.FC<{ component: any } & RouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { user } = useSupabase()

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  )
}
