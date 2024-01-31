import {
  Link,
  MetaFunction,
  useLoaderData,
  useParams,
  Form,
} from '@remix-run/react'
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from '@vercel/remix'
import { startOfDay } from 'date-fns'
import { useRef, useState } from 'react'
import { DaysChip } from '~/components/DaysChip'
import { Database } from '~/database.types'
import {
  getField,
  getPaintHistory,
  logPaintedField,
  updateField,
} from '~/utils/data'
import { getFieldWithAdjustedRainFactorAndDryDays } from '~/utils/predictNextPainting'

type Field = Database['public']['Tables']['fields']['Row']
type PaintHistory = Database['public']['Tables']['paint_history']['Row']

enum PaintActions {
  adjust = 'adjust',
  dontAdjust = 'dontAdjust',
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (!params.fieldName) {
    return redirect(`/fields`)
  }

  const field = await getField({ request, name: params.fieldName })

  if (!field) {
    return redirect(`/fields`)
  }

  const paintHistory = await getPaintHistory({ request, fieldId: field.id })

  return {
    field,
    paintHistory,
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const actionType = formData.get('painted_action')
  const fieldName = formData.get('field_name')

  const field = await getField({ request, name: fieldName?.toString() ?? '' })

  if (!field) throw new Error('Invalid field')

  const updatedField: Field = { ...field }

  switch (actionType) {
    case PaintActions.adjust:
      break
    default:
      break
  }

  // reset the rainfall days:
  updatedField.rainfall_days = 0

  const complete = await updateField({
    fieldName: field.name,
    field: updatedField,
    request,
  })

  return complete
  // return redirect(`/fields/${field.name}`)
}

export const meta: MetaFunction = () => {
  return [
    { title: 'LineUp - Field A' },
    { name: 'description', content: 'LineUp Field Manager - Field Detail A' },
  ]
}
export default function EditField() {
  const { field, paintHistory } = useLoaderData<{
    field: Field
    paintHistory: PaintHistory[]
  }>()
  const params = useParams()
  const [showConfirmPaint, setShowConfirmPaint] = useState(false)
  const paintActionInput = useRef<HTMLInputElement>()

  // const paintField = async ({
  //   shouldAdjustFactor,
  // }: { shouldAdjustFactor?: boolean } = {}) => {
  //   setShowConfirmPaint(false)
  //
  //   let fieldToSave = field
  //   // Get the history for this field and use it to create an average
  //   // for the rainfall factor and max dry days
  //   if (shouldAdjustFactor) {
  //     fieldToSave = getFieldWithAdjustedRainFactorAndDryDays({
  //       currentField: fieldToSave,
  //       // Right now we assume it's unplayable on the date you painted:
  //       markUnplayableOn: startOfDay(new Date()),
  //       paintHistory,
  //     })
  //   }
  //   fieldToSave.last_painted = startOfDay(new Date()).toISOString()
  //   // Reset the rainfall days whenever we paint regardless if we adjusted the factor
  //   fieldToSave.rainfall_days = 0
  //
  //   console.log('Saving field ', { fieldToSave })
  //
  //   // await logPaintedField({
  //   //   field: fieldToSave,
  //   //   previouslyPaintedOn: new Date(field.last_painted ?? new Date()),
  //   // })
  //
  //   // await updateField({ field: fieldToSave })
  // }

  const paintField = (e) => {
    e.preventDefault()
    // Possible validations...

    e.target.submit()
  }

  return (
    <>
      <h1>Field Details {params.fieldName}</h1>
      <DaysChip
        predictedNextPaint={new Date(field.predicted_next_paint ?? new Date())}
        lastPainted={new Date(field.last_painted ?? new Date())}
      />
      <pre>{JSON.stringify(field, null, 2)}</pre>
      <pre>{JSON.stringify(paintHistory ?? [], null, 2)}</pre>
      <Form method="post" onSubmit={paintField}>
        <input type="hidden" name="field_name" value={field.name} />
        <input type="hidden" name="painted_action" ref={paintActionInput} />
        <button
          type="submit"
          onClick={() =>
            (paintActionInput.current!.value = PaintActions.adjust)
          }
        >
          Paint, Adjust Factor
        </button>
        <button
          type="submit"
          onClick={() =>
            (paintActionInput.current!.value = PaintActions.dontAdjust)
          }
        >
          Paint, Leave
        </button>
      </Form>
      <div>
        <Link to="/fields" replace={true}>
          Back
        </Link>
        <Link to="edit">Edit</Link>
      </div>
    </>
  )
}
