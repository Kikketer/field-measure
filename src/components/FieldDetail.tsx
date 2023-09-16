import { useParams, useNavigate } from '@solidjs/router'
import {
  Component,
  Show,
  createResource,
  createSignal,
  useContext,
} from 'solid-js'
import { SIZES } from '../utilities/constants'
import { FieldSize } from '../utilities/types'
import {
  formatDate,
  getPredictedDaysUntilPaint,
  getPredictedNextPaintDate,
} from '../utilities/utils'
import { ErrorPrompt } from './ErrorPrompt'
import styles from './FieldDetail.module.css'
import { getField, saveField } from './FieldStore'
import { Header } from './Header'
import { OnlineContext, OnlineStatus } from './OnlineStatusProvider'
import { StatusLabel } from './StatusLabel'

export const FieldDetail: Component = () => {
  const [fieldId, setFieldId] = createSignal(useParams().id)
  const [field, { refetch, mutate }] = createResource(fieldId, getField)
  const [saveError, setSaveError] = createSignal<string>()
  const isOnline = useContext(OnlineContext)
  const navigate = useNavigate()

  const paintField = async () => {
    if (!field) return

    try {
      const savedField = await saveField({
        ...field(),
        lastPainted: new Date(),
      })
      mutate(savedField)
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
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button
              defaultHref="/fields"
              onClick={() => navigate('/fields', { replace: true })}
            >
              &lt; Lists
            </ion-button>
          </ion-buttons>
          <ion-title>
            <Show when={!field.loading}>{field()?.name}</Show>
          </ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ErrorPrompt error={saveError} />
        <Show when={!field.loading} fallback={<div>Loading...</div>}>
          <h1>{field()?.name}</h1>
          <ion-list>
            <ion-item>
              <StatusLabel field={field} />
            </ion-item>
            <ion-item>
              <strong>Last painted:</strong> {formatDate(field()?.lastPainted)}
            </ion-item>
            <ion-item>
              <strong>Predicted next painting:</strong>{' '}
              {formatDate(getPredictedNextPaintDate(field()))} (
              {getPredictedDaysUntilPaint(field())} days)
            </ion-item>
            <ion-item>
              <strong>Max dry days:</strong> {field()?.maxDryDays}
            </ion-item>
            <ion-item>
              <strong>Rainfall days:</strong> {field()?.rainfallDays}
            </ion-item>
            <ion-item>
              <strong>Rainfall factor:</strong> {field()?.rainfallFactor}
            </ion-item>
            <ion-item>
              <strong>Size:</strong> {field()?.size} (
              {field()?.customLength ??
                SIZES[field()?.size ?? FieldSize.full]?.recommendedMaxLength}
              L x{' '}
              {field()?.customWidth ??
                SIZES[field()?.size ?? FieldSize.full]?.recommendedMaxWidth}
              W)
            </ion-item>
            <ion-item>
              <strong>Location:</strong> {field()?.description}
            </ion-item>
          </ion-list>
          <div>
            <button onClick={paintField} disabled={!isOnline?.()}>
              Mark Painted
            </button>
            {/* <Show when={getIsFieldPlayable(field())}>
              <a role="button" class="contrast">
                Mark Unplayable
              </a>
            </Show> */}
            {/* <a role="button" class="secondary">
              Archive
            </a> */}
            <OnlineStatus />
          </div>
        </Show>
      </ion-content>
    </>
  )
}
