import { useParams } from '@solidjs/router'
import { startOfDay } from 'date-fns'
import {
  Component,
  createEffect,
  createSignal,
  Show,
  useContext,
} from 'solid-js'
import { AuthenticationContext } from '../components/AuthenticationProvider'
import { DaysLeftChip } from '../components/DaysLeftChip'
import { ErrorPrompt } from '../components/ErrorPrompt'
import { Field } from '../components/Field'
import { FieldsContext } from '../components/FieldsProvider'
import { Header } from '../components/Header'
import { OnlineContext } from '../components/OnlineStatusProvider'
import { Page } from '../components/Page'
import { StatusLabel } from '../components/StatusLabel'
import { SupabaseContext } from '../components/SupabaseProvider'
import { SIZES } from '../utilities/constants'
import { getFieldWithAdjustedRainFactorAndDryDays } from '../utilities/predictNextPainting'
import { Field as FieldType, FieldSize } from '../utilities/types'
import { formatDate } from '../utilities/utils'
import styles from './FieldDetail.module.css'

export const FieldDetail: Component = () => {
  const { supabase } = useContext(SupabaseContext)
  const [fieldId, setFieldId] = createSignal(useParams().id)
  const [thisField, setThisField] = createSignal<FieldType>()
  const [saveError, setSaveError] = createSignal<string>()
  const isOnline = useContext(OnlineContext)
  const { user } = useContext(AuthenticationContext)
  const { fields, saveField, fetchFields } = useContext(FieldsContext)

  // Reload fields when this page loads
  fetchFields()

  createEffect(() => {
    setThisField(fields()?.find((field: FieldType) => field.id === fieldId()))
  }, [fields])

  const paintField = async ({ skipFactor }: { skipFactor?: boolean } = {}) => {
    if (!thisField()) return

    let fieldToSave = thisField()!
    if (!skipFactor) {
      fieldToSave = getFieldWithAdjustedRainFactorAndDryDays({
        currentField: fieldToSave,
        // Right now we assume it's unplayable on the date you painted:
        markUnplayableOn: startOfDay(new Date()),
      })
    }
    fieldToSave.lastPainted = startOfDay(new Date())

    await saveField({ field: fieldToSave })
  }

  return (
    <Page>
      {/* Header children won't update unless there's some static text... odd? */}
      <Header backLocation="/fields" editFieldId={thisField()?.id}>
        {thisField()?.name}
      </Header>
      <ErrorPrompt error={saveError} />
      <Show when={thisField()} fallback={<div>Loading...</div>}>
        <div class={styles.DetailContainer}>
          <div class={styles.TitleRow}>
            <h1>{thisField()?.name}</h1>
            <div>
              <StatusLabel field={thisField} />
            </div>
          </div>
          <ul class={styles.List}>
            <li>
              <strong>Last painted:</strong>&nbsp;
              {formatDate(thisField()?.lastPainted)}
            </li>
            <li>
              <strong>Predicted next painting:</strong>&nbsp;
              {formatDate(thisField()?.predictedNextPaint)}
              <DaysLeftChip
                predictedNextPaint={thisField()?.predictedNextPaint}
                lastPainted={thisField()?.lastPainted}
              />
            </li>
            <li>
              <strong>Size:</strong>&nbsp;{thisField()?.size} (
              {thisField()?.customLength ??
                SIZES[thisField()?.size ?? FieldSize.full]
                  ?.recommendedMaxLength}
              L x{' '}
              {thisField()?.customWidth ??
                SIZES[thisField()?.size ?? FieldSize.full]?.recommendedMaxWidth}
              W)
            </li>
            <li>
              <strong>Group:</strong>&nbsp;{thisField()?.group}
            </li>
            <li>
              <strong>Location:</strong>&nbsp;{thisField()?.description}
            </li>
          </ul>
          <details>
            <summary>Details</summary>
            <div class={styles.DetailContainer}>
              <ul>
                <li>
                  <strong>Max dry days:</strong>&nbsp;{thisField()?.maxDryDays}
                </li>
                <li>
                  <strong>Rainfall days:</strong>&nbsp;
                  {thisField()?.rainfallDays}
                </li>
                <li>
                  <strong>Rainfall factor:</strong>&nbsp;
                  {thisField()?.rainfallFactor}
                </li>
              </ul>
              <Field
                fieldSize={() => thisField()?.size as FieldSize}
                customLength={() => thisField()?.customLength}
                customWidth={() => thisField()?.customWidth}
              />
              <div>
                <button
                  class="secondary"
                  onClick={() => paintField({ skipFactor: true })}
                  disabled={!isOnline?.()}
                >
                  Mark Painted but Playable
                </button>
              </div>
            </div>
          </details>
          <div>
            <button onClick={() => paintField()} disabled={!isOnline?.()}>
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
