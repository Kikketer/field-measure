import { FC } from 'react'
import { useAuthentication } from '~/providers/AuthenticationProvider'

export const Slideout: FC = () => {
  const { signOut } = useAuthentication()

  return (
    <aside>
      <button type="button" onClick={() => signOut()}>
        Log Out
      </button>
    </aside>
  )
}
