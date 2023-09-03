import { useParams } from '@solidjs/router'
import { Component, Show, createResource, createSignal } from 'solid-js'
import { getField } from './FieldStore'
import { Header } from './Header'
import { Page } from './Page'
import { StatusLabel } from './StatusLabel'
import styles from './FieldDetail.module.css'
import {
  formatDate,
  getIsFieldPlayable,
  getPredictedNextPaintDate,
} from '../utils'
import { SIZES } from '../constants'
import { FieldSize } from '../types'

export const FieldDetail: Component = () => {
  const [fieldId, setFieldId] = createSignal(useParams().id)
  const [field] = createResource(fieldId, getField)

  const paintField = () => {
    // setTimeout(() => {
    //   // Do something
    // }, 1000)
  }

  const setPlayable = (playable: boolean) => {}

  return (
    <>
      <Header />
      <Show when={!field.loading} fallback={<div>Loading...</div>}>
        <Page>
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
              <strong>Rainfall since painting:</strong> {field()?.rainfallTotal}
              "
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
