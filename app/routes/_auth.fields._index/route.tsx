import { Link, useLoaderData } from '@remix-run/react'
import { DaysChip } from '~/components/DaysChip'
import { Footer } from '~/components/Footer'
import { Slideout } from '~/components/Slideout'
import { Database } from '~/database.types'
import { getFields } from '~/utils/data'

type Field = Database['public']['Tables']['fields']['Row']

export async function loader({
  request,
}: {
  request: any
}): Promise<{ fields?: { [groupName: string]: Field[] } }> {
  const fields = await getFields({ request })

  return { fields }
}

export default function route() {
  const { fields } = useLoaderData<{
    fields?: Record<string, Field[]>
  }>()

  return (
    <>
      <h1>Fields</h1>
      <ul>
        {Object.keys(fields ?? {}).map((groupName) => (
          <li key={groupName}>
            <h2>{groupName}</h2>
            <ul>
              {fields![groupName].map((field) => (
                <li key={field.id}>
                  <Link to={`/fields/${field.name}`}>{field.name}</Link>
                  <DaysChip
                    predictedNextPaint={
                      new Date(field.predicted_next_paint ?? new Date())
                    }
                    lastPainted={new Date(field.last_painted ?? new Date())}
                  />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      {/*{navigation.state === 'loading' && <div>LOADING....</div>}*/}
      <Slideout />
      <Footer />
    </>
  )
}
