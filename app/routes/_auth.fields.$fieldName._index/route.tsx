import { redirect } from '@remix-run/node'
import {
  Form,
  Link,
  MetaFunction,
  useLoaderData,
  useParams,
} from '@remix-run/react'
import { createServerClient } from '@supabase/auth-helpers-remix'
import { Database } from '~/database.types'
import { getField, getFields } from '~/utils/data'

type Field = Database['public']['Tables']['fields']['Row']

export async function loader({
  request,
  params,
}: {
  request: any
  params: { fieldName: string }
}) {
  const field = await getField({ request, name: params.fieldName })

  return {
    field,
  }
}

export const meta: MetaFunction = () => {
  return [
    { title: 'LineUp - Field A' },
    { name: 'description', content: 'LineUp Field Manager - Field Detail A' },
  ]
}
export default function EditField() {
  const { field } = useLoaderData<{ field: Field }>()
  const params = useParams()

  return (
    <>
      <h1>Field Details {params.fieldName}</h1>
      <pre>{JSON.stringify(field, null, 2)}</pre>
      <div>
        <Link to="/fields" replace={true}>
          Back
        </Link>
        <Link to="edit">Edit</Link>
      </div>
    </>
  )
}
