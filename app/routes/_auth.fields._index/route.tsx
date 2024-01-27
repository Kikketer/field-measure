import { Link, useLoaderData, useNavigation } from '@remix-run/react'

export function loader() {
  return {}
}

export default function route() {
  const loaderData = useLoaderData()
  const navigation = useNavigation()

  console.log('Rendered ', navigation.state)

  return (
    <>
      <div>Fields...</div>
      <Link to="1111">Field 1111</Link>
      {navigation.state === 'loading' && <div>LOADING....</div>}
    </>
  )
}
