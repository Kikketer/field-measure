import { Form, MetaFunction } from '@remix-run/react'

export const meta: MetaFunction = () => {
  return [
    { title: 'LineUp - Field A' },
    { name: 'description', content: 'LineUp Field Manager - Field Detail A' },
  ]
}
export default function EditField() {
  return <div>Edit Field</div>
}
