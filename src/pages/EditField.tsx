import { A, useNavigate, useParams } from '@solidjs/router'
import { Component, createMemo, useContext } from 'solid-js'
import { getField, saveField as saveFieldToDB } from '../utilities/FieldStore'
import { Page } from '../components/Page'
import { Header } from '../components/Header'
import styles from './EditField.module.css'
import { AuthenticationContext } from '../components/AuthenticationProvider.tsx'
import { getStartOfDate } from '../utilities/utils.ts'

export const EditField: Component = () => {
  const fieldId = useParams().id
  const navigate = useNavigate()
  const auth = useContext(AuthenticationContext)

  const field = createMemo(() => {
    return getField(fieldId)
  })

  const saveField = (e: Event) => {
    e.preventDefault()
    e.stopPropagation()

    const formData = new FormData(e.target as HTMLFormElement)
    const data: { [t: string]: any } = {}

    for (const formElement of formData) {
      data[formElement[0]] = formElement[1]
    }

    // Set the lastPainted as a real date
    data.lastPainted = getStartOfDate(data.lastPainted)

    // Set the rainfallDays to 0 since we are restarting this paint:
    // Eventually we may want to ask if a field is unplayable vs painted
    saveFieldToDB({
      field: { id: fieldId, rainfallDays: 0, ...data },
      paintTeamId: auth.user?.().paintTeam.id,
    })
    navigate(`/fields/${fieldId}`, { replace: true })
  }

  const confirmArchive = () => {
    if (
      confirm(
        'Archive will simply hide the field, you can restore it later. Are you sure?',
      )
    ) {
      saveFieldToDB({
        field: { id: fieldId, active: false },
        paintTeamId: auth.user?.().paintTeam.id,
      })
      navigate(`/fields`, { replace: true })
    }
  }

  const confirmDelete = () => {
    if (confirm('Delete the field forever? Are you sure?')) {
      saveFieldToDB({
        field: { id: fieldId, deleted: true },
        paintTeamId: auth.user?.().paintTeam.id,
      })
      navigate(`/fields`, { replace: true })
    }
  }

  const confirmReset = () => {
    if (confirm('This will reset any rainfall/wear data. Are you sure?')) {
      // TODO more reset when I finally get this figured out:
      saveFieldToDB({
        field: { id: fieldId, rainfallFactor: 1 },
        paintTeamId: auth.user?.().paintTeam.id,
      })
      navigate(`/fields`, { replace: true })
    }
  }

  return (
    <Page>
      <Header backLocation={`/fields/${fieldId}`}>Edit {field()?.name}</Header>
      <form onSubmit={saveField}>
        <label>
          Name:
          <input type="text" name="name" value={field()?.name} />
        </label>
        <label>
          Group:
          <input type="text" name="group" value={field()?.group} />
        </label>
        <label>
          Description:
          <input type="text" name="description" value={field()?.description} />
        </label>
        <label>
          Length:
          <input
            type="text"
            name="customLength"
            value={field()?.customLength}
          />
        </label>
        <label>
          Width:
          <input type="text" name="customWidth" value={field()?.customWidth} />
        </label>
        <details>
          <summary>Advanced</summary>
          <label>
            Mark Last Painted:
            <input
              type="date"
              name="lastPainted"
              value={`${field()?.lastPainted?.getFullYear()}-${
                field()?.lastPainted?.getMonth() + 1
              }-${String(field()?.lastPainted?.getDate()).padStart(2, '0')}`}
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
            onClick={() => navigate(`/fields/${fieldId}`, { replace: true })}
          >
            Cancel
          </button>
          <button type="submit">Save</button>
        </div>
      </form>
    </Page>
  )
}
