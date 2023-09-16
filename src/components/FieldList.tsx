import { A, useNavigate } from '@solidjs/router'
import { Component, For, createResource, useContext } from 'solid-js'
import {
  formatDate,
  getPredictedNextPaintDate,
  getPredictedNextPaintLabel,
} from '../utilities/utils'
import styles from './FieldList.module.css'
import { getFields } from './FieldStore'
import { OnlineContext, OnlineStatus } from './OnlineStatusProvider'
import { StatusLabel } from './StatusLabel'

export const FieldList: Component = () => {
  const isOnline = useContext(OnlineContext)
  const [fields] = createResource(isOnline, getFields)
  const navigate = useNavigate()

  return (
    <>
      <ion-list>
        <For
          each={fields()}
          fallback={<div class={styles.EmptyList}>There are no fields</div>}
        >
          {(field) => (
            <ion-item button onClick={() => navigate(`/field/${field.id}`)}>
              <div class={styles.FieldItemDetail}>
                <div>{field.name}</div>
                <div>Painted: {formatDate(field.lastPainted)}</div>
              </div>
              <div class={styles.StatusContainer}>
                <StatusLabel field={field} />
                <div>
                  {getPredictedNextPaintLabel(getPredictedNextPaintDate(field))}{' '}
                  {formatDate(getPredictedNextPaintDate(field))}
                </div>
              </div>
              <div class={styles.FieldAction}>&gt;</div>
            </ion-item>
          )}
        </For>
      </ion-list>
      <div class={styles.ActionContainer}>
        <A class="button" href="/field/new">
          + Add Field
        </A>
        <A class="button" href="/quick">
          Quick Size
        </A>
        <OnlineStatus />
      </div>
    </>
  )
}
