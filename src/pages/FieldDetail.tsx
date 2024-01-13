import { useParams } from '@solidjs/router'
import { differenceInCalendarDays, startOfDay } from 'date-fns'
import {
  Component,
  createEffect,
  createSignal,
  Show,
  useContext,
} from 'solid-js'
import { AuthenticationContext } from '../providers/AuthenticationProvider'
import { ConfirmPaint } from '../components/ConfirmPaint'
import { DaysLeftChip } from '../components/DaysLeftChip'
import { ErrorPrompt } from '../components/ErrorPrompt'
import { Field } from '../components/Field'
import { FieldsContext } from '../providers/FieldsProvider'
import { Header } from '../components/Header'
import { OnlineContext } from '../providers/OnlineStatusProvider'
import { Page } from '../components/Page'
import { StatusLabel } from '../components/StatusLabel'
import { SupabaseContext } from '../providers/SupabaseProvider'
import { SIZES } from '../utilities/constants'
import { getPaintHistory } from '../utilities/FieldStore'
import { getFieldWithAdjustedRainFactorAndDryDays } from '../utilities/predictNextPainting'
import { Field as FieldType, FieldSize } from '../utilities/types'
import { formatDate } from '../utilities/utils'
import styles from './FieldDetail.module.css'

export const FieldDetail: Component = () => {
  const { supabase } = useContext(SupabaseContext)
  const [fieldId, setFieldId] = createSignal(useParams().id)
  const [thisField, setThisField] = createSignal<FieldType>()
  const [saveError, setSaveError] = createSignal<string>()
  const [showConfirmPaint, setShowConfirmPaint] = createSignal(false)
  const isOnline = useContext(OnlineContext)
  const { user } = useContext(AuthenticationContext)
  const { fields, saveField, fetchFields, logPaintedField, getPaintHistory } =
    useContext(FieldsContext)

  // Reload fields when this page loads
  fetchFields()

  createEffect(() => {
    setThisField(fields()?.find((field: FieldType) => field.id === fieldId()))
  }, [fields])

  const paintField = async ({
    shouldAdjustFactor,
  }: { shouldAdjustFactor?: boolean } = {}) => {
    if (!thisField()) return
    setShowConfirmPaint(false)

    let fieldToSave = thisField()!
    // Get the history for this field and use it to create an average
    // for the rainfall factor and max dry days
    const paintHistory = await getPaintHistory()
    if (shouldAdjustFactor) {
      fieldToSave = getFieldWithAdjustedRainFactorAndDryDays({
        currentField: fieldToSave,
        // Right now we assume it's unplayable on the date you painted:
        markUnplayableOn: startOfDay(new Date()),
        paintHistory,
      })
    }
    fieldToSave.lastPainted = startOfDay(new Date())
    // Reset the rainfall days whenever we paint regardless if we adjusted the factor
    fieldToSave.rainfallDays = 0

    console.log('Saving field ', { fieldToSave, thisField: thisField() })

    await logPaintedField({
      field: fieldToSave,
      previouslyPaintedOn: thisField()?.lastPainted,
    })

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
              <strong>Last painted:</strong>
              {formatDate(thisField()?.lastPainted)}
            </li>
            <li>
              <strong>Predicted next painting:</strong>
              {formatDate(thisField()?.predictedNextPaint)}
              <DaysLeftChip
                predictedNextPaint={thisField()?.predictedNextPaint}
                lastPainted={thisField()?.lastPainted}
              />
            </li>
            <li>
              <strong>Size:</strong>
              {thisField()?.size} (
              {thisField()?.customLength ??
                SIZES[thisField()?.size ?? FieldSize.full]
                  ?.recommendedMaxLength}
              L x{' '}
              {thisField()?.customWidth ??
                SIZES[thisField()?.size ?? FieldSize.full]?.recommendedMaxWidth}
              W)
            </li>
            <li>
              <strong>Description:</strong>
              {thisField()?.description}
            </li>
            <li>
              <strong>Group:</strong>
              {thisField()?.group}
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
                  {Math.floor((thisField()?.rainfallFactor ?? 0) * 1000) / 1000}
                </li>
              </ul>
              <Field
                fieldSize={() => thisField()?.size as FieldSize}
                customLength={() => thisField()?.customLength}
                customWidth={() => thisField()?.customWidth}
              />
            </div>
          </details>
          <div>
            <button
              onClick={() => setShowConfirmPaint(true)}
              disabled={
                !isOnline?.() ||
                differenceInCalendarDays(
                  new Date(),
                  thisField()?.lastPainted ?? new Date(),
                ) < 3
              }
            >
              Mark Painted
            </button>
          </div>
          <ConfirmPaint
            show={showConfirmPaint}
            daysRemaining={() =>
              differenceInCalendarDays(
                thisField()?.predictedNextPaint ?? new Date(),
                new Date(),
              )
            }
            reasonableLimitOfOverdueDays={() =>
              (thisField()?.maxDryDays ?? 0) * 2
            }
            onPaint={paintField}
            onCancel={() => setShowConfirmPaint(false)}
          />
        </div>
      </Show>
    </Page>
  )
}
