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
import { ErrorPrompt } from '../components/ErrorPrompt'
import styles from './FieldDetail.module.css'
import { getField, saveField } from '../components/FieldStore'
import { Header } from '../components/Header'
import { OnlineContext, OnlineStatus } from '../components/OnlineStatusProvider'
import { StatusLabel } from '../components/StatusLabel'
import { Page } from '../components/Page'
import { Field } from '../components/Field'

export const FieldDetail: Component = () => {
  const [fieldId, setFieldId] = createSignal(useParams().id)
  const [field, { mutate }] = createResource(fieldId, getField)
  const [saveError, setSaveError] = createSignal<string>()
  const isOnline = useContext(OnlineContext)
  const navigate = useNavigate()

  const paintField = async () => {
    if (!field) return

    const savedField = saveField({
      ...field(),
      lastPainted: new Date(),
    })
    mutate(savedField)
    navigate(`/fields`, { replace: true })
  }

  const setPlayable = (playable: boolean) => {
    // TODO playable will just extend the "base days" or "rain factor" by 1
  }

  return (
    <Page>
      {/* Header children won't update unless there's some static text... odd? */}
      <Header backLocation="/fields" editFieldId={field()?.id}>
        &nbsp;{field()?.name}&nbsp;
      </Header>
      <ErrorPrompt error={saveError} />
      <Show when={!field.loading} fallback={<div>Loading...</div>}>
        <div class={styles.DetailContainer}>
          <div class={styles.TitleRow}>
            <h1>{field()?.name}</h1>
            <div>
              <StatusLabel field={field()} />
            </div>
          </div>
          <ul>
            <li>
              <strong>Last painted:</strong>&nbsp;
              {formatDate(field()?.lastPainted)}
            </li>
            <li>
              <strong>Predicted next painting:</strong>&nbsp;
              {formatDate(getPredictedNextPaintDate(field()))} (
              {getPredictedDaysUntilPaint(field())} days)
            </li>
            <li>
              <strong>Size:</strong>&nbsp;{field()?.size} (
              {field()?.customLength ??
                SIZES[field()?.size ?? FieldSize.full]?.recommendedMaxLength}
              L x{' '}
              {field()?.customWidth ??
                SIZES[field()?.size ?? FieldSize.full]?.recommendedMaxWidth}
              W)
            </li>
            <li>
              <strong>Location:</strong>&nbsp;{field()?.description}
            </li>
          </ul>
          <details>
            <summary>Details</summary>
            <ul>
              <li>
                <strong>Max dry days:</strong>&nbsp;{field()?.maxDryDays}
              </li>
              <li>
                <strong>Rainfall days:</strong>&nbsp;{field()?.rainfallDays}
              </li>
              <li>
                <strong>Rainfall factor:</strong>&nbsp;{field()?.rainfallFactor}
              </li>
            </ul>
            <Field
              fieldSize={() => field()?.size as FieldSize}
              customLength={() => field()?.customLength}
              customWidth={() => field()?.customWidth}
            />
          </details>
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
        </div>
      </Show>
    </Page>
  )
}