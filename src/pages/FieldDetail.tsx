import { useParams } from '@solidjs/router'
import {
  Component,
  createResource,
  createSignal,
  Show,
  useContext,
} from 'solid-js'
import { SIZES } from '../utilities/constants'
import { FieldSize } from '../utilities/types'
import { formatDate } from '../utilities/utils'
import { ErrorPrompt } from '../components/ErrorPrompt'
import styles from './FieldDetail.module.css'
import { getField, saveField as saveFieldToDb } from '../utilities/FieldStore'
import { Header } from '../components/Header'
import { OnlineContext } from '../components/OnlineStatusProvider'
import { StatusLabel } from '../components/StatusLabel'
import { Page } from '../components/Page'
import { Field } from '../components/Field'
import { AuthenticationContext } from '../components/AuthenticationProvider'
import { startOfDay } from 'date-fns'
import { DaysLeftChip } from '../components/DaysLeftChip'
import { getFieldWithAdjustedRainFactorAndDryDays } from '../utilities/predictNextPainting'

export const FieldDetail: Component = () => {
  const [fieldId, setFieldId] = createSignal(useParams().id)
  const [field, { mutate }] = createResource(fieldId, getField)
  const [saveError, setSaveError] = createSignal<string>()
  const isOnline = useContext(OnlineContext)
  const { user } = useContext(AuthenticationContext)

  const paintField = async () => {
    if (!field) return

    const fieldWithNewFactor = getFieldWithAdjustedRainFactorAndDryDays({
      currentField: field()!,
      // Right now we assume it's unplayable on the date you painted:
      markUnplayableOn: startOfDay(new Date()),
    })
    fieldWithNewFactor.lastPainted = startOfDay(new Date())

    const savedField = saveFieldToDb({
      field: fieldWithNewFactor,
      paintTeamId: user?.().paintTeam.id,
    })
    mutate(savedField)
  }

  return (
    <Page>
      {/* Header children won't update unless there's some static text... odd? */}
      <Header backLocation="/fields" editFieldId={field()?.id}>
        {field()?.name}
      </Header>
      <ErrorPrompt error={saveError} />
      <Show when={!field.loading} fallback={<div>Loading...</div>}>
        <div class={styles.DetailContainer}>
          <div class={styles.TitleRow}>
            <h1>{field()?.name}</h1>
            <div>
              <StatusLabel field={field} />
            </div>
          </div>
          <ul>
            <li>
              <strong>Last painted:</strong>&nbsp;
              {formatDate(field()?.lastPainted)}
            </li>
            <li>
              <strong>Predicted next painting:</strong>&nbsp;
              {formatDate(field()?.predictedNextPaint)}
              <DaysLeftChip predictedNextPaint={field()?.predictedNextPaint} />
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
              <strong>Group:</strong>&nbsp;{field()?.group}
            </li>
            <li>
              <strong>Location:</strong>&nbsp;{field()?.description}
            </li>
          </ul>
          <details>
            <summary>Details</summary>
            <div class={styles.DetailContainer}>
              <ul>
                <li>
                  <strong>Max dry days:</strong>&nbsp;{field()?.maxDryDays}
                </li>
                <li>
                  <strong>Rainfall days:</strong>&nbsp;{field()?.rainfallDays}
                </li>
                <li>
                  <strong>Rainfall factor:</strong>&nbsp;
                  {field()?.rainfallFactor}
                </li>
              </ul>
              <Field
                fieldSize={() => field()?.size as FieldSize}
                customLength={() => field()?.customLength}
                customWidth={() => field()?.customWidth}
              />
              <div>
                <button
                  class="secondary"
                  onClick={paintField}
                  disabled={!isOnline?.()}
                >
                  Mark Painted but Playable
                </button>
              </div>
            </div>
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
          </div>
        </div>
      </Show>
    </Page>
  )
}
