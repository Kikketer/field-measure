import { Form, MetaFunction, useLoaderData, useParams } from '@remix-run/react'

// Server side loader bit:
// export async function loader({ params }: { params: { fieldId: string } }) {
//   await new Promise((resolve) => setTimeout(resolve, 1000))
//   return {
//     message: `Field ${params.fieldId}`,
//   }
// }

export const meta: MetaFunction = () => {
  return [
    { title: 'LineUp - Field A' },
    { name: 'description', content: 'LineUp Field Manager - Field Detail A' },
  ]
}
export default function EditField() {
  // const { message } = useLoaderData<{ message: string }>()
  const params = useParams()

  return (
    <>
      <div>Edit Field {params.fieldId}</div>
      <div>Message: </div>
    </>
  )
}
