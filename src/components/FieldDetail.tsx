import { useParams } from '@solidjs/router'
import { Component, Show, createResource, createSignal } from 'solid-js'
import { SIZES } from '../utilities/constants'
import { FieldSize } from '../utilities/types'
import {
  formatDate,
  getIsFieldPlayable,
  getPredictedNextPaintDate,
} from '../utilities/utils'
import styles from './FieldDetail.module.css'
import { getField, saveField } from './FieldStore'
import { Header } from './Header'
import { Page } from './Page'
import { StatusLabel } from './StatusLabel'

export const FieldDetail: Component = () => {
  const [fieldId, setFieldId] = createSignal(useParams().id)
  const [field] = createResource(fieldId, getField)
  const [saveError, setSaveError] = createSignal<string | null>(null)

  const paintField = async () => {
    if (!field) return

    try {
      await saveField({ ...field(), lastPainted: new Date() })
    } catch (err) {
      console.error(err)
      setSaveError((err as Error).message)
    }
  }

  const setPlayable = (playable: boolean) => {
    // TODO playable will just extend the "base days" or "rain factor" by 1
  }

  return (
    <>
      <Header />
      <Show when={!field.loading} fallback={<div>Loading...</div>}>
        <Page>
          <h1>{field()?.name}</h1>
          <ul class="none">
            <li>
              <div class={styles.StatusRow}>
                <StatusLabel field={field()} />
              </div>
            </li>
            <li>
              <strong>Last painted:</strong> {formatDate(field()?.lastPainted)}
            </li>
            <li>
              <strong>Predicted next painting:</strong>{' '}
              {formatDate(getPredictedNextPaintDate(field()))}
            </li>
            <li>
              <strong>Max dry days:</strong> {field()?.maxDryDays}
            </li>
            <li>
              <strong>Rainfall days:</strong> {field()?.rainfallDays}
            </li>
            <li>
              <strong>Rainfall factor:</strong> {field()?.rainfallFactor}
            </li>
            <li>
              <strong>Size:</strong> {field()?.size} (
              {field()?.customLength ??
                SIZES[field()?.size ?? FieldSize.full]?.recommendedMaxLength}
              L x{' '}
              {field()?.customWidth ??
                SIZES[field()?.size ?? FieldSize.full]?.recommendedMaxWidth}
              W)
            </li>
            <li>
              <strong>Location:</strong> {field()?.description}
            </li>
          </ul>
          <div>
            <Show when={getIsFieldPlayable(field())}>
              <button class="contrast">Unplayable</button>
            </Show>
            <button onClick={paintField}>Mark Painted</button>
            <a role="button" class="secondary">
              Archive
            </a>
          </div>
        </Page>
      </Show>
    </>
  )
}
