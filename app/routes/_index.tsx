import { Link } from '@remix-run/react'
import type { MetaFunction } from '@vercel/remix'
import { useAuthentication } from '~/providers/AuthenticationProvider'

export const meta: MetaFunction = () => {
  return [
    { title: 'LineUp - Fields' },
    { name: 'description', content: 'LineUp Field Manager - Fields List' },
  ]
}

export default function _index() {
  const { loading, signIn, signOut, user } = useAuthentication()

  return (
    <div>
      <ul>
        <li>
          <Link to="fields">Fields Base</Link>
        </li>
      </ul>
      <pre>
        {JSON.stringify(loading)} and {JSON.stringify(!!user)}
      </pre>
      <button type="button" onClick={() => signIn()}>
        Login
      </button>
      <button type="button" onClick={() => signOut()}>
        Log out
      </button>
    </div>
  )
}
