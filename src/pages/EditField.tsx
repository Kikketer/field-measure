import { A, useNavigate, useParams } from '@solidjs/router'
import { Component, createMemo } from 'solid-js'
import { getField, saveField as saveFieldToDB } from '../utilities/FieldStore'
import { Page } from '../components/Page'
import { Header } from '../components/Header'
import styles from './EditField.module.css'

export const EditField: Component = () => {
  const fieldId = useParams().id
  const navigate = useNavigate()

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

    saveFieldToDB({ id: fieldId, ...data })
    navigate(`/fields/${fieldId}`, { replace: true })
  }

  const confirmArchive = () => {
    if (
      confirm(
        'Archive will simply hide the field, you can restore it later. Are you sure?',
      )
    ) {
      saveFieldToDB({ id: fieldId, active: false })
      navigate(`/fields`, { replace: true })
    }
  }

  const confirmDelete = () => {
    if (confirm('Delete the field forever? Are you sure?')) {
      // saveFieldToDB({ id: fieldId, _deleted: true })
      navigate(`/fields`, { replace: true })
    }
  }

  const confirmReset = () => {
    if (confirm('This will reset any rainfall/wear data. Are you sure?')) {
      // TODO more reset when I finally get this figured out:
      saveFieldToDB({ id: fieldId, rainfallFactor: 1 })
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
            Sort Order:
            <input type="number" name="sortOrder" value={field()?.sortOrder} />
          </label>
          <label>
            Max Dry Days:
            <input
              type="number"
              name="maxDryDays"
              value={field()?.maxDryDays}
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
