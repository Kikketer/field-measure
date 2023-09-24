import { useNavigate } from '@solidjs/router'
import { Component, For, createMemo, createSignal, useContext } from 'solid-js'
import { getFields } from '../components/FieldStore'
import { Header } from '../components/Header'
import { OnlineContext, OnlineStatus } from '../components/OnlineStatusProvider'
import { Page } from '../components/Page'
import { StatusLabel } from '../components/StatusLabel'
import { ChevronRight } from '../components/chevron-right'
import { Field } from '../utilities/types'
import {
  formatDate,
  getPredictedDaysUntilPaint,
  getPredictedNextPaintDate,
  getPredictedNextPaintLabel,
} from '../utilities/utils'
import styles from './FieldList.module.css'

export const FieldList: Component = () => {
  const isOnline = useContext(OnlineContext)
  const navigate = useNavigate()
  const [fields, setFields] = createSignal<Field[]>()

  const onUpdateFields = (fields: Field[]) => {
    setFields(fields)
  }

  setFields(
    createMemo(() => {
      // Just trigger based on isOnline changing...
      if (isOnline?.()) {
        return getFields(isOnline?.(), onUpdateFields)
      }
      return getFields(isOnline?.(), onUpdateFields)
    }),
  )

  return (
    <Page>
      <Header>Fields</Header>
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
