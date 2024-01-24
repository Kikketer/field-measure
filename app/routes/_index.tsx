import { Link } from '@remix-run/react'
import type { MetaFunction } from '@vercel/remix'

export const meta: MetaFunction = () => {
  return [
    { title: 'LineUp - Fields' },
    { name: 'description', content: 'LineUp Field Manager - Fields List' },
  ]
}

export default function _index() {
  return (
    <div>
      <ul>
        <li>
          <Link to="fields">Fields Base</Link>
        </li>
        <li>
          <Link to="fields/1111">Fields ID</Link>
        </li>
      </ul>
    </div>
  )
}
