import { useNavigate } from '@solidjs/router'
import {
  Component,
  For,
  createEffect,
  createResource,
  createSignal,
  useContext,
} from 'solid-js'
import {
  formatDate,
  getPredictedDaysUntilPaint,
  getPredictedNextPaintDate,
  getPredictedNextPaintLabel,
} from '../utilities/utils'
import styles from './FieldList.module.css'
import { getFields } from './FieldStore'
import { OnlineContext, OnlineStatus } from './OnlineStatusProvider'
import { Page } from './Page'
import { StatusLabel } from './StatusLabel'
import { Header } from './Header'
import { ChevronRight } from './chevron-right'
import { Field } from '../utilities/types'

export const FieldList: Component = () => {
  const isOnline = useContext(OnlineContext)
  const navigate = useNavigate()
  const [fields, setFields] = createSignal<Field[]>()

  const onUpdateFields = (fields: Field[]) => {
    console.log('Updating')
    setFields(fields)
  }

  createEffect(() => {
    if (isOnline?.()) {
      setFields(getFields(isOnline?.(), onUpdateFields))
    }
  })

  return (
    <Page>
      <Header hideBack={true}>Fields</Header>
      <ul class={styles.FieldList}>
        <For
          each={fields()}
          fallback={<div class={styles.EmptyList}>There are no fields</div>}
        >
          {(field) => (
            <li
              class={styles.FieldItem}
              onClick={() => navigate(`/field/${field.id}`)}
            >
              <div>
                <div>
                  <strong>{field.name}</strong>
                </div>
                <div>Painted: {formatDate(field.lastPainted)}</div>
              </div>
              <div class={styles.EndSlot}>
                <div class={styles.StatusContainer}>
                  <StatusLabel field={field} />
                  <div>
                    {getPredictedNextPaintLabel(
                      getPredictedNextPaintDate(field),
                    )}{' '}
                    {formatDate(getPredictedNextPaintDate(field))} [
                    {getPredictedDaysUntilPaint(field)}]
                  </div>
                </div>
                <ChevronRight />
              </div>
            </li>
          )}
        </For>
      </ul>
      <div class={styles.ActionContainer}>
        <button onClick={() => navigate('/field/new')}>+ Add Field</button>
        <button onClick={() => navigate('/quick')}>Quick Size</button>
      </div>
      <OnlineStatus />
    </Page>
  )
}
