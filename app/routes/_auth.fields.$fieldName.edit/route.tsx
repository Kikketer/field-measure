import { ActionFunctionArgs, redirect } from '@vercel/remix'
import { Form, Link, useLoaderData, useNavigate } from '@remix-run/react'
import { createServerClient } from '@supabase/auth-helpers-remix'
import { Database } from '~/database.types'
import { getField, updateField } from '~/utils/data'

type Field = Database['public']['Tables']['fields']['Row']

export async function loader({
  request,
  params,
}: {
  request: any
  params: { fieldName: string }
}) {
  const field = await getField({ request, name: params.fieldName })

  if (!field) {
    return redirect(`/fields`)
  }

  return { field }
}

export const action = async ({ params, request }: ActionFunctionArgs) => {
  // invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData()
  const updates = Object.fromEntries(formData) as Partial<Field>

  if (!params.fieldName) return redirect(`/fields`)

  const updatedField = await updateField({
    request,
    fieldName: params.fieldName,
    field: updates,
  })

  return redirect(`/fields/${updatedField?.name}`)
}

export default function FieldEdit() {
  const { field } = useLoaderData<{ field: Field }>()
  const navigate = useNavigate()

  const cancel = () => {
    navigate(`/fields/${field.name}`, { replace: true })
  }

  return (
    <>
      <h1>Edit Field</h1>
      <Form key={field.id} method="post">
        <div>
          <label>
            Name:
            <input name="name" type="text" defaultValue={field.name} />
          </label>
        </div>
        <button type="submit">Save</button>
        <button type="button" onClick={cancel}>
          Cancel
        </button>
      </Form>
      <div>
        <Link to={`/fields/${field.name}`} replace={true}>
          Back
        </Link>
      </div>
    </>
  )
}
