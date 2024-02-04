import { Link } from '@remix-run/react'

export default function Quick() {
  return (
    <div>
      <h1>Quick Measure</h1>
      <Link to="/fields" replace={true}>
        Fields
      </Link>
      <Link to="/" replace={true}>
        Root
      </Link>
    </div>
  )
}
