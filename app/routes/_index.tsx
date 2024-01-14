import { Link } from '@remix-run/react'
import type { MetaFunction } from '@vercel/remix'

export const meta: MetaFunction = () => {
  return [
    { title: 'LineUp - Fields' },
    { name: 'description', content: 'LineUp Field Manager - Fields List' },
  ]
}

export default function Index() {
  return (
    <div>
      <ul>
        <li>
          <Link to="field/123">Edit Field 123</Link>
        </li>
      </ul>
    </div>
  )
}
