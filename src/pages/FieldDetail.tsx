import { useParams } from '@solidjs/router'
import {
  Component,
  createEffect,
  createSignal,
  Show,
  useContext,
} from 'solid-js'
import { SIZES } from '../utilities/constants'
import { Field as FieldType, FieldSize } from '../utilities/types'
import { formatDate } from '../utilities/utils'
import { ErrorPrompt } from '../components/ErrorPrompt'
import styles from './FieldDetail.module.css'
import { saveField as saveFieldToDb } from '../utilities/FieldStore'
import { Header } from '../components/Header'
import { OnlineContext } from '../components/OnlineStatusProvider'
import { StatusLabel } from '../components/StatusLabel'
import { Page } from '../components/Page'
import { Field } from '../components/Field'
import { AuthenticationContext } from '../components/AuthenticationProvider'
import { startOfDay } from 'date-fns'
import { DaysLeftChip } from '../components/DaysLeftChip'
import { getFieldWithAdjustedRainFactorAndDryDays } from '../utilities/predictNextPainting'
import { FieldsContext } from '../components/FieldsProvider'

export const FieldDetail: Component = () => {
  const [fieldId, setFieldId] = createSignal(useParams().id)
  const [thisField, setThisField] = createSignal<FieldType>()
  const [saveError, setSaveError] = createSignal<string>()
  const isOnline = useContext(OnlineContext)
  const { user } = useContext(AuthenticationContext)
  const { fields } = useContext(FieldsContext)

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

    await saveFieldToDb({
      field: fieldToSave,
      paintTeamId: user?.().paintTeam.id,
    })
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
          <ul>
            <li>
              <strong>Last painted:</strong>&nbsp;
              {formatDate(thisField()?.lastPainted)}
            </li>
            <li>
              <strong>Predicted next painting:</strong>&nbsp;
              {formatDate(thisField()?.predictedNextPaint)}
              <DaysLeftChip
                predictedNextPaint={thisField()?.predictedNextPaint}
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
