import { Outlet } from '@remix-run/react'

export default function route() {
  return (
    <>
      <div>Fields...</div>
      <Outlet />
    </>
  )
}
