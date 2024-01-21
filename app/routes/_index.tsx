import { Link } from '@remix-run/react'
import type { MetaFunction } from '@vercel/remix'
import { useMessaging } from '~/providers/MessagingProvider'

export const meta: MetaFunction = () => {
  return [
    { title: 'LineUp - Fields' },
    { name: 'description', content: 'LineUp Field Manager - Fields List' },
  ]
}

export default function Index() {
  const { log } = useMessaging()

  return (
    <div>
      <ul>
        <li>
          <Link to="field/123">Edit Field 123</Link>
        </li>
      </ul>
      <pre>{log}</pre>
    </div>
  )
}
