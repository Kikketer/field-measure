import { useNavigate, useParams } from '@solidjs/router'
import { Component, createEffect, createSignal, useContext } from 'solid-js'
import { parse, set, startOfDay } from 'date-fns'
import { SupabaseContext } from '../components/SupabaseProvider'
import { saveField as saveFieldToDB } from '../utilities/FieldStore'
import { Page } from '../components/Page'
import { Header } from '../components/Header'
import styles from './EditField.module.css'
import { AuthenticationContext } from '../components/AuthenticationProvider'
import { Field as FieldType } from '../utilities/types'
import { FieldsContext } from '../components/FieldsProvider'

export const EditField: Component = () => {
  const supabaseContext = useContext(SupabaseContext)
  const [fieldId, setFieldId] = createSignal(useParams().id)
  const navigate = useNavigate()
  const [thisField, setThisField] = createSignal<FieldType>()
  const auth = useContext(AuthenticationContext)
  const { fields } = useContext(FieldsContext)

  createEffect(() => {
    setThisField(fields()?.find((field: FieldType) => field.id === fieldId()))
  }, [fields])

  const saveField = (e: Event) => {
    e.preventDefault()
    e.stopPropagation()

    const formData = new FormData(e.target as HTMLFormElement)
    const data: { [t: string]: any } = {}

    for (const formElement of formData) {
      data[formElement[0]] = formElement[1]
    }

    // Set the lastPainted as a real date
    // Start of the day local to the user (so we keep the time then go start of day)
    data.lastPainted = startOfDay(
      set(parse(data.lastPainted, 'yyyy-MM-dd', new Date()), {
        hours: new Date().getHours(),
        minutes: new Date().getMinutes(),
      }),
    )

    // Set the rainfallDays to 0 since we are restarting this paint:
    // Eventually we may want to ask if a field is unplayable vs painted
    saveFieldToDB({
      supabase: supabaseContext.supabase,
      field: { id: fieldId(), rainfallDays: 0, ...data },
      paintTeamId: auth.user?.().paintTeam.id,
    })
    navigate(`/fields/${fieldId()}`, { replace: true })
  }

  const confirmArchive = () => {
    if (
      confirm(
        'Archive will simply hide the field, you can restore it later. Are you sure?',
      )
    ) {
      saveFieldToDB({
        supabase: supabaseContext.supabase,
        field: { id: fieldId(), active: false },
        paintTeamId: auth.user?.().paintTeam.id,
      })
      navigate(`/fields`, { replace: true })
    }
  }

  const confirmDelete = () => {
    if (confirm('Delete the field forever? Are you sure?')) {
      saveFieldToDB({
        supabase: supabaseContext.supabase,
        field: { id: fieldId(), deleted: true },
        paintTeamId: auth.user?.().paintTeam.id,
      })
      navigate(`/fields`, { replace: true })
    }
  }

  const confirmReset = () => {
    if (confirm('This will reset any rainfall/wear data. Are you sure?')) {
      saveFieldToDB({
        supabase: supabaseContext.supabase,
        field: { id: fieldId(), rainfallFactor: 1 },
        paintTeamId: auth.user?.().paintTeam.id,
      })
      navigate(`/fields`, { replace: true })
    }
  }

  return (
    <Page>
      <Header backLocation={`/fields/${fieldId()}`}>
        Edit {thisField()?.name}
      </Header>
      <form onSubmit={saveField}>
        <label>
          Name:
          <input type="text" name="name" value={thisField()?.name} />
        </label>
        <label>
          Group:
          <input type="text" name="group" value={thisField()?.group} />
        </label>
        <label>
          Description:
          <input
            type="text"
            name="description"
            value={thisField()?.description}
          />
        </label>
        <label>
          Length:
          <input
            type="text"
            name="customLength"
            value={thisField()?.customLength}
          />
        </label>
        <label>
          Width:
          <input
            type="text"
            name="customWidth"
            value={thisField()?.customWidth}
          />
        </label>
        <details>
          <summary>Advanced</summary>
          <label>
            Mark Last Painted:
            <pre>{JSON.stringify(thisField()?.lastPainted)}</pre>
            <input
              type="date"
              name="lastPainted"
              value={`${thisField()?.lastPainted?.getFullYear()}-${
                (thisField()?.lastPainted?.getMonth() ?? 0) + 1
              }-${String(thisField()?.lastPainted?.getDate()).padStart(
                2,
                '0',
              )}`}
            />
          </label>
          <div class={styles.ActionBox}>
            <button type="button" class="danger" onClick={confirmDelete}>
              Delete
            </button>
            <button type="button" class="secondary" onClick={confirmReset}>
              Reset
            </button>
            <button type="button" class="secondary" onClick={confirmArchive}>
              Archive
            </button>
          </div>
        </details>
        <div class={styles.ActionBox}>
          <button
            type="button"
            class="secondary"
            onClick={() => navigate(`/fields/${fieldId()}`, { replace: true })}
          >
            Cancel
          </button>
          <button type="submit">Save</button>
        </div>
      </form>
    </Page>
  )
}
