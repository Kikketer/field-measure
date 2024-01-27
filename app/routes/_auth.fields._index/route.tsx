import { Link, useLoaderData, useNavigation } from '@remix-run/react'
import { useAuthentication } from '~/providers/AuthenticationProvider'

export function loader() {
  return {}
}

export default function route() {
  const loaderData = useLoaderData()
  const navigation = useNavigation()
  const { signOut } = useAuthentication()

  console.log('Rendered ', navigation.state)

  return (
    <>
      <div>Fields...</div>
      <Link to="1111">Field 1111</Link>
      {navigation.state === 'loading' && <div>LOADING....</div>}
      <br />
      <button type="button" onClick={signOut}>
        Log Out
      </button>
    </>
  )
}
